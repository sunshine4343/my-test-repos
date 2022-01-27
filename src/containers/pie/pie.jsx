import React, { Component } from 'react';
import ReactEcharts from 'echarts-for-react';

export default class Pie extends Component {
    getOption = () => {
        return {
            title: {
                text: '饼状图一'
            },
            series: [
                {
                    type: 'pie',
                    data: [
                        {
                            value: 335,
                            name: '直接访问'
                        },
                        {
                            value: 234,
                            name: '联盟广告'
                        },
                        {
                            value: 1548,
                            name: '搜索引擎'
                        }
                    ]
                }
            ]
        }
    }

    render() {
        return (
            <ReactEcharts option={this.getOption()} />
        )
    }
}
