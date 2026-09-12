import {
    RegisterWebsite,
    Website,
    type WebsitePageDefinition,
} from "@hotbunny/hackhub-content-sdk";

import {
    Q01_CLIENT_NAME,
    Q01_TARGET_IP,
    Q01_WEB_AUDIT_PATH,
    Q01_WEB_HOST,
} from "../../../content/index.js";

import homePage from "./q01-home.html";
import securityPage from "./q01-security.html";

@RegisterWebsite
export class Q01SkynetLogisticsWebsite extends Website {
    SiteName = Q01_CLIENT_NAME;
    Host = Q01_WEB_HOST;
    Icon = "";

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
    ];

    Exports = {
        clientName: Q01_CLIENT_NAME,
        targetIp: Q01_TARGET_IP,
    };
}
