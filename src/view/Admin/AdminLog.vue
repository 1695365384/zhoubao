<template>
    <div>
        <div>

            <!--    查询条件部分-->
            <Row style="margin-top:15px; ">
                        <Col span="5">
                            选择日期: &nbsp;
                            <DatePicker
                                    format="yyyy-MM-dd"
                                    @on-change="dataSelectChange"
                                    type="daterange"
                                    placement="bottom-end"
                                    placeholder="请选择截止时间"
                                    style="width: 70%"></DatePicker>

                        </Col>

                        <!--            <Col span="8">-->
                        <!--              选择名字: &nbsp;-->
                        <!--              <Select-->
                        <!--                v-model="userName"-->
                        <!--                placeholder="请选择或者搜索你的名字"-->
                        <!--                filterable-->
                        <!--                clearable-->
                        <!--                style="width: 60%;"-->
                        <!--              >-->
                        <!--                <Option v-for="item in cascadeData" :value="item.label" :key="item.value">{{ item.label }}</Option>-->
                        <!--              </Select>-->
                        <!--            </Col>-->

                        <Col span="4">
                            <Button type="primary" @click="getLogList">查询</Button>
                        </Col>

                        <Col span="12">
                            <p style="width: 40%">
                                <strong style="font-size: 15px;">上周未提交周报成员:</strong>
                            </p>

                            <h3 style="width: 60%;">
                                <span style="margin-right:  10px;color:red;" v-for="name in notFinishedList">{{name.userName }}&nbsp;</span>
                            </h3>
                        </Col>

            </Row>


            <Row>
                <Col>

                    <Card style="margin-top: 15px;margin-bottom: 0;">
                        <div>
                            <table style="width: 100%;" cellspacing="0" cellpadding="0" border="1" ref="logTab">
                                <thead class="demo-table-info-row">
                                <th v-for="head in columns1" :width="head.width" height="35px">
                                    <span>{{head.title}}</span>
                                </th>
                                </thead>
                                <tbody>

                                <tr v-for="(tabTR,index) in tabData">
                                    <td class="show_tab" v-if="tabTR.rowSpan"
                                        :rowspan="tabTR.rowSpan?tabTR.rowSpan:null">{{tabTR.name}}
                                    </td>
                                    <td class="show_tab"><span>{{tabTR.index+1 | capNumber }}</span> {{tabTR.target }}
                                    </td>
                                    <td>
                                        <p style="width: 98%;font-size: 18px;font-weight: 500;margin: 10px;" v-for="(list,index) in tabTR.Major">{{index+1+'.'+ list.content}}</p>
                                    </td>
                                </tr>
                                </tbody>

                            </table>

                        </div>
                        <!--            <div >-->
                        <!--              <Page v-if="pageTotal!==0" :current="currentPage" @on-change="pageChange" :total="pageTotal"-->
                        <!--                    :page-size="pageSize"/>-->
                        <!--            </div>-->
                    </Card>

                </Col>
            </Row>


        </div>
    </div>
</template>

<script>
    export default {
        name: "AdminLog",
        data() {
            return {
                cascadeData: [], /** 选择成员下拉框的数据*/
                selectDate: '', /** 当前选择的时间*/
                userID: '', /**用户id*/
                startTime: "", /**开始时间*/
                endTIme: '', /**结束时间*/
                userName: '', /**用户名称*/

                pageTotal: 0,/*总条数*/
                currentPage: 1,/*当前页码*/
                pageSize: 14, /**每页多少*/
                pageHandlerData: [], /**分页后的数据*/

                notFinishedList: [],/*未提交周报人员名单**/


                sysId: '', /**管理员id*/
                columns1: [
                    {
                        title: '姓名',
                        className: "demo-table-info-row",
                        width: "15%"
                    },
                    {
                        title: '项目名称',
                        key: 'target',
                        width: "30%"
                    },
                    {
                        title: '提交内容',
                        key: 'address',
                        width: "40%"
                    },

                ],
                tabData: [],
            }
        },
        created() {
            this.getUser();
            this.getLogList();
            this.getLastLogUserList()
        },
        methods: {
            /*获取用户列表*/
            getUser() {
                this.$http.post('/api/user/get_user', {}).then(res => {
                    if (res.data.respCode === "200") {
                        let userList = res.data.data.list
                        this.cascadeData = userList.map(item => {
                            return {
                                value: item.id,
                                label: item['userName']
                            }
                        })
                    } else {
                        this.$Notice.info({
                            title: "获取列表失败"
                        })
                    }
                }).catch(err => {
                    if (err) {
                        this.$Notice.error({
                            title: "服务器数据异常"
                        })
                    }
                })
            },

            /** 时间选择器改变的事件*/
            dataSelectChange(date) {
                this.selectDate = date
                let [startTime, endTIme] = this.selectDate
                this.startTime = startTime
                this.endTIme = endTIme
            },

            /**获取周报列表*/
            getLogList() {
                this.getAdminID()
                let startTime = this.startTime
                let endTime = this.endTIme
                let pageNo = this.pageNo
                let pageSize = this.pageSize
                let userName = this.userName + ""
                let data = {
                    startTime,
                    endTime,
                    pageNo,
                    pageSize,
                    userName,
                    sysId: this.sysId + ""
                }

                this.$http.post('/api/weekly/admin_get_log', {data: data}).then(res => {
                    let {respCode, data,respMsg} = res.data
                    let logList = []
                    if (respCode && respCode === '200') {

                        this.pageTotal = data['total']
                        data['list'].map((item) => {
                            let body = JSON.parse(item['body'])
                            body.map((cont, index) => {
                                if (index === 0) {
                                    cont['rowSpan'] = body.length
                                }
                                cont['createTime'] = item['createTime']
                                cont['index'] = index
                                cont['team'] = item['team']['name']
                                cont['name'] = item['user']['userName']
                                logList.push(cont)
                            })
                        })
                        this.tabData = logList
                    } else {
                        this.$Notice.error({
                            title: respMsg
                        })
                    }
                }).catch(err => {
                    if (err) {
                        this.$Notice.error({
                            title: '服务器异常'
                        })
                    }
                })
            },

            /**页码点击的事件*/
            pageChange(pageNo) {
                this.pageNo = pageNo
            },

            /**页码大小调整的事件**/
            pageTotalChange(pageSize) {
                this.pageSize = pageSize
            },

            /**获取管理员id*/
            getAdminID() {
                let admin = JSON.parse(window.localStorage.getItem('admin'))
                let {id} = admin
                this.sysId = id
            },

            /***获取上周周报未提交人员名单*/
            getLastLogUserList() {
                let admin = JSON.parse(window.localStorage.getItem('admin'))
                let {id} = admin
                this.$http.post('/api/user/get_user', {data: {sysId: id + ""}}).then(res => {
                    if (res.data['respCode'] === '200') {
                        this.notFinishedList = res.data.data['list'].filter(item => item['notFinished'] === '0')
                    }
                })
            },

        },
        filters: {
            capNumber(value) {
                if (!value) return ''
                switch (value) {
                    case 1:
                        return "一、";
                    case 2:
                        return "二、";
                    case 3:
                        return "三、";
                    case 4:
                        return "四、";
                    case 5:
                        return "五、";
                    default :
                        return ''
                }
            }
        }
    }
</script>

<style scoped>
    .demo-table-info-row {
        text-align: center;
        margin-top: 25px;

    }

    .demo-table-info-row th {
    }

    .show_tab {
        text-align: center;
        font-weight: 700;
        font-size: 20px;
    }

</style>
