import React from "react";
import { Table as AntdTable } from 'antd';
import "./Table.scss";

const Table = ({header = [], rows = [], onRowClick = () => {}}) => {
    return <AntdTable className={"__table"}
                      columns={header}
                      dataSource={rows}
                  onRow={(record, rowIndex) => {
        return {
            onClick: () => {
                onRowClick(record)
            }, // click row
        };
    }}/>
}

export default Table;