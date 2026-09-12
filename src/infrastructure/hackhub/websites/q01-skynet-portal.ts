import {
    RegisterWebsite,
    Website,
    type WebsitePageDefinition,
} from "@hotbunny/hackhub-content-sdk";

import {
    Q01_CLIENT_NAME,
    Q01_TARGET_IP,
    Q01_WEB_AUDIT_PATH,
    Q01_WEB_FORBIDDEN_PATHS,
    Q01_WEB_HOST,
    Q01_WEB_SURFACE_PATHS,
} from "../../../content/index.js";

import forbiddenPage from "./q01-forbidden.html";
import homePage from "./q01-home.html";
import securityPage from "./q01-security.html";

const forbiddenPages: WebsitePageDefinition[] = Q01_WEB_FORBIDDEN_PATHS.map(
    (path) => ({
        path,
        title: `${Q01_CLIENT_NAME} — Forbidden`,
        description: "Restricted public web surface.",
        html: forbiddenPage,
    }),
);

@RegisterWebsite
export class Q01SkynetLogisticsWebsite extends Website {
    SiteName = Q01_CLIENT_NAME;
    Host = Q01_WEB_HOST;
    Icon = "";

    // The root domain is the public homepage. Four non-root web surfaces
    // are registered; only /security is the authorized audit target.
    Pages: WebsitePageDefinition[] = [
        {
            path: "/",
            title: `${Q01_CLIENT_NAME} — Operations Portal`,
            description: `${Q01_CLIENT_NAME} public operations portal.`,
            html: homePage,
        },
        {
            path: Q01_WEB_AUDIT_PATH,
            title: `${Q01_CLIENT_NAME} — Security Review`,
            description: "External security review surface for authorized auditors.",
            html: securityPage,
        },
        ...forbiddenPages,
    ];

    override Exports = {
        clientName: Q01_CLIENT_NAME,
        targetIp: Q01_TARGET_IP,
        webSurfacePaths: Q01_WEB_SURFACE_PATHS,
    };
}
