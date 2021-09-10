import React, {useEffect, useMemo, useState} from "react";
import objectPath from "object-path";
import {Topbar} from "./topbar";
import {AnimateLoading} from "../../../../_metronic/_partials/controls";
import {useHtmlClassService} from "../../_core/metronic-layout";
import {HeaderMenuWrapper} from "./header-menu/header-menu-wrapper";
import {FormattedDate, FormattedMessage} from "react-intl";

export function Header() {
    const uiService: any = useHtmlClassService();
    const layoutProps = useMemo(() => {
        return {
            headerClasses: uiService.getClasses("header", true),
            headerAttributes: uiService.getAttributes("header"),
            headerContainerClasses: uiService.getClasses("header_container", true),
            menuHeaderDisplay: objectPath.get(
                uiService.config,
                "header.menu.self.display"
            )
        };
    }, [uiService]);

    return (
        <>
            {/*begin::Header*/}
            <div
                className={`header ${layoutProps.headerClasses} ml-3 mr-3`}
                id="kt_header"
                {...layoutProps.headerAttributes}
            >
                {/*begin::Container*/}
                <div
                    className={` ${layoutProps.headerContainerClasses} d-flex align-items-stretch justify-content-between`}>
                    <AnimateLoading/>
                    {/*begin::Header Menu Wrapper*/}
                    {layoutProps.menuHeaderDisplay && <HeaderMenuWrapper/>}
                    {!layoutProps.menuHeaderDisplay && <div/>}
                    {/*end::Header Menu Wrapper*/}

                    {/*begin::Topbar*/}
                    <Topbar/>
                    {/*end::Topbar*/}
                </div>
                {/*end::Container*/}
            </div>
            {/*end::Header*/}
        </>
    );
}
