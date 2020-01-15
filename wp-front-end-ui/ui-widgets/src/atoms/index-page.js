import * as React from 'react';
import connect from "react-redux/lib/connect/connect";
import {DAContainer} from "../molecules/static/styles/materialui-styles";


class IndexPage extends React.Component {
    render() {
        const {userInfo} = this.props;

        return (
            <React.Fragment>
                <DAContainer maxWidth="md" >
                    {userInfo.user_name}, Welcome to index page
                </DAContainer>
            </React.Fragment>
        )
    }
}


const mapState2Props = (state) => {
    return state;
};

export default connect(mapState2Props)(IndexPage);