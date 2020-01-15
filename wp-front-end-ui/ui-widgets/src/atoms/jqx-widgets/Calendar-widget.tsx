import * as React from 'react';
import JqxCalendar from 'jqwidgets-scripts/jqwidgets-react-tsx/jqxcalendar';
class CalendarWidget extends React.PureComponent<{}> {
    private myCalendar = React.createRef<JqxCalendar>();
    constructor(props: {}) {
        super(props);
    };
    public getSelectedDate(){
        let date = this.myCalendar.current!.getDate();
        return date;
    }
    public render() {
        return (
            <JqxCalendar ref={this.myCalendar} width={220} height={220} />
        );
    }
}
export default CalendarWidget;