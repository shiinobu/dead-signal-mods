import {
    App,
    RegisterApp,
} from "@hotbunny/hackhub-content-sdk";
import appHTML from "../../../dead-signal.html";

import {
    executeDssCommand,
} from "../dss-command-runtime.js";
import {
    opsRuntime,
} from "../../../application/ops/runtime.js";
import type {
    OpsCommandDefinition,
} from "../../../application/ops/command-registry.js";
import type {
    OpsSessionSnapshot,
} from "../../../application/ops/session-store.js";
import type {
    OpsToolDefinition,
} from "../../../application/ops/tool-registry.js";
import type {
    ReconProfile,
} from "../../../domain/recon/index.js";

const DSS_DIRECT_INTERACTION_PATCH = `
<script>
(() => {
  const views={terminal:'view-terminal',recon:'view-recon',wireshark:'view-wireshark'};
  const $=id=>document.getElementById(id);
  const text=(id,value)=>{const el=$(id);if(el)el.textContent=String(value??'')};
  const progress=value=>{const v=Math.max(0,Math.min(100,Number(value)||0));text('percent',v+'%');const bar=$('bar');if(bar)bar.style.width=v+'%'};
  const appendLine=(value,kind='line-info')=>{const output=$('terminal-output');if(!output)return;const el=document.createElement('div');el.className='line '+kind;el.textContent=String(value??'');output.append(el);while(output.children.length>36)output.removeChild(output.firstChild)};
  const globalExport=(name)=>{const value=globalThis[name];return typeof value==='function'?value:null};
  const getSdk=()=>globalThis.HackhubSDK;
  const emitCommandRequest=(commandLine)=>{const sdk=getSdk();if(!sdk?.Events?.emit)return false;sdk.Events.emit('DSS.Command.Request',{commandLine});return true};
  const getSession=()=>{const fn=globalExport('getSession');if(!fn)return null;try{return fn()}catch{return null}};
  const getReconProfiles=()=>{const fn=globalExport('getReconProfiles');if(!fn)return[];try{const value=fn();return Array.isArray(value)?value:[]}catch{return[]}};

  let reconProjectionPending=false;
  let reconProjectionSeenRunning=false;
  let reconProjectionDeadline=0;

  const renderReconSession=(session)=>{
    if(!session)return;
    const status=String(session.status||'idle').toLowerCase();
    const total=Number(session.totalSources||0);
    const completed=Number(session.completedSources||0);
    const candidates=Number(session.candidatesFound||0);
    const unique=Number(session.uniqueHostsFound||0);
    const hosts=Array.isArray(session.discoveredHosts)?session.discoveredHosts:[];
    const percentValue=total>0?Math.round((completed/total)*100):0;

    text('session-status',status.toUpperCase());
    text('session-target',session.target||'—');
    text('session-profile',session.profileId||'—');
    text('session-hosts',unique);
    text('sources',completed+'/'+total);
    text('candidates',candidates);
    text('unique',unique);
    text('host-count',hosts.length);
    text('profile',session.profileId?String(session.profileId).toUpperCase():'NO PROFILE');
    progress(percentValue);

    const state=$('scan-state');
    if(state){
      if(status==='running')state.textContent='Reconnaissance running.';
      else if(status==='completed')state.textContent='Enumeration completed in '+(session.lastElapsedMs??0)+' ms.';
      else if(status==='failed')state.textContent='Reconnaissance failed.';
      else state.textContent='Ready for reconnaissance.';
    }

    const results=$('results');
    if(results){
      results.innerHTML='';
      if(!hosts.length)results.innerHTML='<div class="empty">'+(status==='running'?'Scanning...':'No findings yet.')+'</div>';
      else hosts.forEach(host=>{const row=document.createElement('div');row.className='host';row.textContent=host;results.append(row)});
    }

    const profiles=getReconProfiles();
    const profile=profiles.find(value=>value&&value.id===session.profileId);
    const sourceList=$('source-list');
    if(sourceList){
      sourceList.innerHTML='';
      if(!profile||!Array.isArray(profile.sources)){
        sourceList.innerHTML='<div class="empty">No profile loaded.</div>';
      }else{
        profile.sources.forEach((source,index)=>{
          const active=status==='running'&&index===Math.min(completed,profile.sources.length-1);
          const complete=index<completed;
          const row=document.createElement('div');
          row.className='source'+(active?' active':'')+(complete?' done':'');
          row.innerHTML='<div class="mark"></div><div><div class="source-name"></div><div class="source-desc"></div></div><div class="source-count"></div>';
          row.querySelector('.mark').textContent=complete?'✓':active?'›':'·';
          row.querySelector('.source-name').textContent=source.name;
          row.querySelector('.source-desc').textContent=source.description;
          row.querySelector('.source-count').textContent=complete?(Array.isArray(source.candidates)?source.candidates.length:0)+' found':active?'scanning':'pending';
          sourceList.append(row);
        });
      }
    }
  };

  const projectReconSession=()=>{
    const session=getSession();
    if(!session)return;
    const status=String(session.status||'idle').toLowerCase();
    if(reconProjectionPending){
      if(status==='running')reconProjectionSeenRunning=true;
      if(reconProjectionSeenRunning&&(status==='completed'||status==='failed')){
        reconProjectionPending=false;
        reconProjectionSeenRunning=false;
      }else if(Date.now()>reconProjectionDeadline){
        reconProjectionPending=false;
        reconProjectionSeenRunning=false;
      }else if(status!=='running'){
        return;
      }
    }
    renderReconSession(session);
  };

  const installReconScroller=()=>{
    const view=$('view-recon');
    if(!view)return;
    view.dataset.dssReconScrollReady='true';
  };

  let reconProjectionTimer=setInterval(projectReconSession,100);

  const invokeCommand=async(commandLine)=>{
    const fn=globalExport('executeCommand');
    if(fn){await Promise.resolve(fn(commandLine));return true}
    return emitCommandRequest(commandLine)
  };

  const startRecon=(target)=>invokeCommand('recon -d '+target);

  const bind=()=>{
    installReconScroller();
    const reconForm=$('recon-form');
    const reconButton=$('recon-run');
    const reconTarget=$('recon-target');
    if(reconButton&&!reconButton.dataset.dssDirectBound){
      reconButton.type='button';
      reconButton.dataset.dssDirectBound='true';
      reconButton.addEventListener('click',async()=>{
        const target=reconTarget?.value.trim();
        if(!target||reconButton.disabled)return;
        reconButton.disabled=true;
        const state=$('scan-state');
        const bar=$('bar');
        if(state)state.textContent='Starting reconnaissance.';
        progress(0);
        text('profile','RUNNING');
        text('sources','0/0');
        text('candidates','0');
        text('unique','0');
        const results=$('results');
        const sourceList=$('source-list');
        if(results)results.innerHTML='<div class="empty">Scanning...</div>';
        if(sourceList)sourceList.innerHTML='<div class="empty">Loading profile...</div>';
        reconProjectionPending=true;
        reconProjectionSeenRunning=false;
        reconProjectionDeadline=Date.now()+15000;
        try{
          const ok=await startRecon(target);
          const session=getSession();
          if(session)renderReconSession(session);
          reconProjectionPending=false;
          reconProjectionSeenRunning=false;
          if(!ok){
            if(state)state.textContent='DSS reconnaissance runtime rejected the target.';
            reconButton.disabled=false;
          }else{
            reconButton.disabled=false;
          }
        }catch(error){
          if(state)state.textContent=error instanceof Error?error.message:'Reconnaissance failed.';
          reconButton.disabled=false;
          reconProjectionPending=false;
          reconProjectionSeenRunning=false;
        }
      });
    }

    const commandForm=$('cmd-form');
    const commandButton=$('cmd-run');
    const commandInput=$('cmd-input');
    const commandOutput=$('terminal-output');
    if(commandButton&&!commandButton.dataset.dssDirectBound){
      commandButton.type='button';
      commandButton.dataset.dssDirectBound='true';
      commandButton.addEventListener('click',async()=>{
        const commandLine=commandInput?.value.trim();
        if(!commandLine)return;
        if(commandOutput){const line=document.createElement('div');line.className='line line-info';line.textContent='dss~$ '+commandLine;commandOutput.append(line);while(commandOutput.children.length>36)commandOutput.removeChild(commandOutput.firstChild)}
        if(commandInput)commandInput.value='';
        if(commandLine.toLowerCase()==='clear'){
          if(commandOutput)commandOutput.innerHTML='';
          const line=document.createElement('div');
          line.className='line line-info';
          line.textContent='DSS // Dead Signal System';
          commandOutput?.append(line);
          commandInput?.focus();
          return;
        }
        try{
          const ok=await invokeCommand(commandLine);
          if(!ok&&commandOutput){
            const line=document.createElement('div');
            line.className='line line-warn';
            line.textContent='DSS command bridge is unavailable.';
            commandOutput.append(line);
          }
        }catch(error){
          if(commandOutput){
            const line=document.createElement('div');
            line.className='line line-warn';
            line.textContent=error instanceof Error?error.message:'Command execution failed.';
            commandOutput.append(line);
          }
        }
        commandInput?.focus();
      });
    }

    if(reconForm)reconForm.addEventListener('submit',event=>event.preventDefault());
    if(commandForm)commandForm.addEventListener('submit',event=>event.preventDefault());
  };

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',bind,{once:true});
  else bind();
})();
</script>`;

const DSS_RECON_SCROLL_STYLE = `
<style>
.content{
  position:relative;
}
.view-recon.active{
  display:block;
  position:absolute;
  top:26px;
  right:26px;
  bottom:16px;
  left:26px;
  width:auto;
  height:auto;
  min-height:0;
  max-height:none;
  overflow-y:scroll;
  overflow-x:hidden;
  padding:0 10px 24px 0;
  box-sizing:border-box;
  scrollbar-gutter:stable;
}
.view-recon.active > .dss-recon-scroll{
  display:contents;
}
.view-recon.active::-webkit-scrollbar{width:10px}
.view-recon.active::-webkit-scrollbar-track{background:#061015}
.view-recon.active::-webkit-scrollbar-thumb{background:#18343d;border-radius:8px}
.view-recon.active{scrollbar-width:thin;scrollbar-color:#18343d #061015}
</style>`;

const dssHTML = appHTML.includes('</body>')
    ? appHTML.replace('</body>', `${DSS_DIRECT_INTERACTION_PATCH}${DSS_RECON_SCROLL_STYLE}</body>`)
    : `${appHTML}${DSS_DIRECT_INTERACTION_PATCH}${DSS_RECON_SCROLL_STYLE}`;

@RegisterApp
export class DeadSignalApp extends App {
    AppName = "dss";
    Title = "DSS";
    Icon = "./assets/dss.svg";
    HTML = dssHTML;
    DefaultSize = { width: 1220, height: 800 };
    override MinSize = { width: 1200, height: 780 };
    override Unlocked = true;

    override Store = {
        title: "DSS",
        ratings: 0,
        description: "DSS // Dead Signal System — integrated investigation workspace.",
    };

    override Exports = {
        getToolCatalog: (): readonly OpsToolDefinition[] => opsRuntime.tools.getAll(),
        getCommandCatalog: (): readonly OpsCommandDefinition[] => opsRuntime.commands.getAll(),
        getSession: (): OpsSessionSnapshot => opsRuntime.session.getSnapshot(),
        getReconProfiles: (): readonly ReconProfile[] => opsRuntime.recon.getProfiles(),
        startRecon: (target: string): Promise<boolean> => executeDssCommand(`recon -d ${target}`),
        executeCommand: (commandLine: string): Promise<boolean> => executeDssCommand(commandLine),
    };
}
