import * as React from "react";
// const React = require("react");
// @ts-ignore
import {DropdownItem, DropdownMenu, DropdownToggle, Nav, NavItem, NavLink, UncontrolledDropdown} from 'reactstrap';

class TopNavbar extends React.PureComponent {
    createNavItems = () => {
        //@ts-ignore
        let items = this.props.items;
        // alert(JSON.stringify(items))
        let navItems = []
        for (let i = 0; i < items.length; i++) {
            let href = items[i]["href"];
            let name = items[i]["name"];
            navItems.push(
                <NavItem key={"NavItem-" + i}>
                    <NavLink key={"NavLink-" + i} href={href} >{name}</NavLink>
                </NavItem>
            )
        }
        return navItems;
    }
    createAuthDropDownList = () => {
        //@ts-ignore
        let ddName = this.props.dropdownName;
        if (ddName != null) {
            //@ts-ignore
            let ddItems = this.props.ddItems;
            let dropdownItems = []
            for (let i = 0; i < ddItems.length; i++) {
                let href = ddItems[i]["href"];
                let name = ddItems[i]["name"];
                let key = "DropDownItem-" + i;
                dropdownItems.push(
                    <NavItem key={"DDNavItem-" + i}><NavLink key={"DDNavLink-" + i} href={href} className={"btn blue-gradient btn-block btn-sm"}><i
                        className={ddItems[i].fa}> {name} </i></NavLink>
                    </NavItem>)
                dropdownItems.push(<DropdownItem divider/>)
            }
            var dropdown =
                <UncontrolledDropdown key={"UnDropdown"} nav inNavbar>
                    <DropdownToggle className={"btn blue-gradient btn-block btn-sm"} key={"DropdownToggle"} caret><i
                        className="fa fa-user"> {ddName}</i></DropdownToggle>
                    <DropdownMenu key={DropdownMenu} className={"site-dropdown"} style={{
                        "right": "0px",
                        "left": "auto"
                    }}> {dropdownItems}</DropdownMenu>
                </UncontrolledDropdown>
            return dropdown;
        }
        else {
            var signInItem = <UncontrolledDropdown key={"UnDropdown"} nav inNavbar>
                <DropdownToggle className={"btn blue-gradient btn-sm"} key={"DropdownToggle"} data-toggle="modal"
                                data-target="#SigninModal" role="button">
                    {/*<NavLink key={"DDNavLink-1"} href="accounts/login/">*/}
                     <i className="fa fa-sign-in"> Sign In </i>
                    {/*</NavLink>*/}
                </DropdownToggle>
            </UncontrolledDropdown>;
            return signInItem;
        }
    }

    render() {
        return (
            <React.Fragment>
                <Nav id={"TopNavLeft"} className="mr-auto">
                    {this.createNavItems()}
                </Nav>
                <Nav id={"TopNavRight"} className="ml-auto">
                    {this.createAuthDropDownList()}
                </Nav>
            </React.Fragment>
        );
    }
}

export default TopNavbar;