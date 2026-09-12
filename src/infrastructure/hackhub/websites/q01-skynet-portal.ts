import {
    RegisterWebsite,
    Website,
    type WebsitePageDefinition,
} from "@hotbunny/hackhub-content-sdk";

import {
    Q01_CLIENT_NAME,
    Q01_TARGET_IP,
    Q01_WEB_AUDIT_HOST,
    Q01_WEB_FORBIDDEN_HOSTS,
    Q01_WEB_HOME_HOST,
} from "../../../content/index.js";

import forbiddenPage from "./q01-forbidden.html";
import homePage from "./q01-home.html";
import securityPage from "./q01-security.html";

const rootPage = (
    html: string,
    title: string,
    description: string,
): WebsitePageDefinition => ({
    path: "/",
    title,
    description,
    html,
});

@RegisterWebsite
export class Q01SkynetLogisticsWebsite extends Website {
    SiteName = Q01_CLIENT_NAME;
    Host = Q01_WEB_HOME_HOST;
    Icon = "";

    Pages: WebsitePageDefinition[] = [
        rootPage(
            homePage,
            `${Q01_CLIENT_NAME} — Operations Portal`,
            `${Q01_CLIENT_NAME} public operations portal.`,
        ),
    ];

    override Exports = {
        clientName: Q01_CLIENT_NAME,
        targetIp: Q01_TARGET_IP,
    };
}

@RegisterWebsite
export class Q01SkynetLogisticsPortalWebsite extends Website {
    SiteName = Q01_CLIENT_NAME;
    Host = Q01_WEB_FORBIDDEN_HOSTS[0];
    Icon = "";

    Pages: WebsitePageDefinition[] = [
        rootPage(
            forbiddenPage,
            `${Q01_CLIENT_NAME} — Forbidden`,
            "Restricted public web surface.",
        ),
    ];
}

@RegisterWebsite
export class Q01SkynetLogisticsStatusWebsite extends Website {
    SiteName = Q01_CLIENT_NAME;
    Host = Q01_WEB_FORBIDDEN_HOSTS[1];
    Icon = "";

    Pages: WebsitePageDefinition[] = [
        rootPage(
            forbiddenPage,
            `${Q01_CLIENT_NAME} — Forbidden`,
            "Restricted public web surface.",
        ),
    ];
}

@RegisterWebsite
export class Q01SkynetLogisticsSecurityWebsite extends Website {
    SiteName = Q01_CLIENT_NAME;
    Host = Q01_WEB_AUDIT_HOST;
    Icon = "";

    Pages: WebsitePageDefinition[] = [
        rootPage(
            securityPage,
            `${Q01_CLIENT_NAME} — Security Review`,
            "External security review surface for authorized auditors.",
        ),
    ];
}
