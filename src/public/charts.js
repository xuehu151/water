const echarts = require('echarts/lib/echarts');
require('echarts/lib/chart/bar');
require('echarts/lib/chart/line');
require('echarts/lib/chart/pie');
require('echarts/lib/component/tooltip');
require('echarts/lib/component/dataZoom');

//echarts构建图表

    //柱状图
    export const barCharts = (el, dataX, dataY, barColor,splitLineColor) => {
        const barOption = {
            series: [{
                type: 'bar',
                data: dataY,
                itemStyle: {
                  normal: {
                    color: barColor
                  }
                },
                barWidth: 25
            }],
            xAxis: {
                titile: {
                  show: false
                },
                data: dataX,
                axisLine: {
                  itemStyle: {
                    normal: {
                      color: '#00FF00'
                    }
                  },
                  lineStyle: {
                    type: 'solid',
                    color: '#868fab',
                    width: '1'
                  }
                },
                splitLine: {
                    show: true,
                    lineStyle: {
                        color: splitLineColor
                    }
                },
            },
            yAxis: {
                type: 'value',
                splitLine: {
                    show: true,
                    lineStyle: {
                        color: splitLineColor
                    }
                },
                axisLine: {
                    lineStyle: {
                        type: 'solid',
                        color: '#868fab',
                        width: '1'
                    }
                }
            }
        };
        const bar = echarts.init(el);
        bar.setOption(barOption);
        return bar;
    };

    //饼状图（dom，data[jsonArray], borderColor, 是否显示指示线[boolean],圆心[array],半径[array]）
    export const pieCharts = (el, data, borderColor, isLabel, color, radius, center) => {
        const pieOption = {
            tooltip: {
                trigger: 'item',
                formatter: '{b}<br/>  {c} ({d}%)'
            }, 
            series: [{
                type: 'pie',
                itemStyle: {
                    normal: {
                        color: {
                            colorStops: [
                                {offset: 1,color: color}
                            ]
                        },
                        borderWidth: 2,
                        borderColor: borderColor
                    }
                },
                center: center,
                radius: radius,
                labelLine: {
                    normal: {
                        show: isLabel,
                        lineStyle: {
                            color: '#ccc'
                        }
                    }
                },
                label: {
                    normal: {
                        show: isLabel,
                        fontSize: 12,
                        color: '#ccc'
                    }
                },
                data: data
            }]
        };
        const pie = echarts.init(el);
        pie.setOption(pieOption);
        return pie;
    };

    //折线图 没有datazoom功能
    export const lineCharts = (el, dataX, dataY) => {
        const lineOption = {
            xAxis: {
                data: dataX,
                axisLine: {
                    lineStyle: {
                        type: 'solid',
                        color: '#868fab',
                        width: '1'
                    }
                },
                type: 'category',
                splitLine: {
                    show: true,
                    lineStyle: {
                        color: '#f2f2f2'
                    }
                },
                boundaryGap: false,
            },
            yAxis: {
                splitLine: {
                    show: true,
                    lineStyle: {
                        color: '#f2f2f2'
                    }
                },
                axisLine: {
                    lineStyle: {
                        type: 'solid',
                        color: '#868fab',
                        width: '1'
                    }
                }
            },
            series: [
                {
                    type: 'line',
                    data: dataY,
                    symbol: 'circle',
                    symbolSize: 8,
                    itemStyle: {
                    normal: {
                        color: '#01bdda',
                        radius: 20,
                        lineStyle: {
                            color: '#9aedfd',
                            width: 3
                        }
                    }
                },
                areaStyle: {normal: {
                //color: 'red'
                    color: new echarts.graphic.LinearGradient(
                        0, 0, 0, 1,
                        [
                            {offset: 0.2, color: 'rgba(54,124,184,1)'},
                            {offset: 0.5, color: 'rgba(57,168,213,1)'},
                            {offset: 0.9, color: 'rgba(60,201,229,1)'}
                        ]
                    )
                }}
                }
            ] 
        };
        const line = echarts.init(el);
        line.setOption(lineOption);
        return line;
    };

    //折线图 带缩放功能
    export const lineChartsWithZoom = (el,dataX,dataY) => {
        const lineZoomOption = {
            xAxis: {
                data: dataX,
                axisLine: {
                    lineStyle: {
                        type: 'solid',
                        color: '#868fab',
                        width: '1'
                    }
                },
                splitLine: {
                    show: true,
                    lineStyle: {
                        color: '#f2f2f2'
                    }
                },
                boundaryGap: false
            },
            yAxis: {
                splitLine: {
                    show: true,
                    lineStyle: {
                        color: '#f2f2f2'
                    }
                },
                axisLine: {
                    lineStyle: {
                        type: 'solid',
                        color: '#868fab',
                        width: '1'
                    }
                }
            },
            dataZoom: [
                {
                    type: 'slider',
                    show: true,
                    xAxisIndex: [0],
                    start: 1,
                    end: 35
                },
                {
                    type: 'inside',
                    xAxisIndex: [0],
                    start: 1,
                    end: 35
                }
            ],
            series: [
                {
                    type: 'line',
                    data: dataY,
                    symbol: 'circle',
                    symbolSize: 8,
                    itemStyle: {
                        normal: {
                            color: '#01bdda',
                            radius: 20,
                            lineStyle: {
                                color: '#f5ca47',
                                width: 3
                            }
                        }
                    },
                }
            ] 
        };
        const zoomLine = echarts.init(el);
        zoomLine.setOption(lineZoomOption);
        return zoomLine;
    };

    //电子大屏折线图
    export const screenLine = (el,dataX,dataY) => {
       const screenLineOption = {
            xAxis: {
                data: dataX,
                axisLine: {
                    lineStyle: {
                        type: 'solid',
                        color: '#868fab',
                        width: '1'
                    }
                },
                type: 'category',
                splitLine: {
                    show: true,
                    lineStyle: {
                        color: '#2a3a6b'
                    }
                }
            },
            yAxis: {
                splitLine: {
                    show: true,
                    lineStyle: {
                        color: '#2a3a6b'
                    }
                },
                axisLine: {
                    lineStyle: {
                        type: 'solid',
                        color: '#868fab',
                        width: '1'
                    }
                }
            },
            series: [
                {
                    type: 'line',
                    data: dataY,
                    symbol: 'circle',
                    symbolSize: 10,
                    itemStyle: {
                        normal: {
                            color: '#01bdda',
                            radius: 20,
                            lineStyle: {
                                color: '#3d779f',
                                width: 3
                            }
                        }
                  },
                  areaStyle: {
                        normal: {
                         //color: 'red'
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                                { offset: 0, color: 'rgba(12,97,146,.5)' },
                                { offset: 0.5, color: 'rgba(12,97,146,.8)' },
                                { offset: 0.9, color: 'rgba(11,157,198,1)' }
                            ])
                        }
                    }
                }
            ]   
       };
       const screenLineCharts = echarts.init(el);
       screenLineCharts.setOption(screenLineOption);
       return screenLineCharts; 
    };

    //电子大屏设备状态饼图
    export const screenPie = (el,data) => {
        const colors = ['#b5b5b5', '#00d2eb', '#f2bf0f'];
        const screenPieOption = {
            series: [
                {
                    type: 'pie',
                    center: ['50%', '50%'],
                    radius: ['42%', '60%'],
                    data: data,
                    labelLine: {
                        normal: {
                            length: 30
                        }
                    },
                    label: {
                    show: true,
                        fontSize: 15
                    }
                }
            ],
            color: colors 
        };
        const pie = echarts.init(el);
        pie.setOption(screenPieOption);
        return pie; 
    };


