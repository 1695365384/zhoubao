<template>
    <div>
        <Row>
            <Col span="5">
                <Button type="info" class="btn_col" v-if="addUserShow" @click="addUserModalOpen">添加成员</Button>
                <Button type="info" class="btn_col" @click="bindUserClick">用户绑定</Button>
            </Col>
            <Col span="6">
                <Input search class="btn_col" v-model="searchContent" style="width: 270px;" enter-button="搜索"
                       @on-search="searchItem" placeholder="请输入搜索内容"/>
            </Col>
            <Col span="2">

            </Col>
        </Row>

        <Row>
            <Col>
                <Table border :columns="userHead"
                       :data="pageHandlerData.slice((currentPage - 1) * pageSize, pageSize * currentPage)">
                    <template  slot-scope="{ row, index }" slot="action" >
                        <Button :disabled="!addUserShow" type="error" @click="removeUser(row)">删除用户</Button>
                    </template>

                    <template slot="notFinished" slot-scope="{row}">
                        <Button :type="row.notFinished==='0'?'warning':'info'" size="small">
                            {{row.notFinished==="1"?'已交':"未交"}}
                        </Button>
                    </template>
                </Table>
            </Col>
        </Row>

        <Row style="padding: 10px;">
            <Col>
                <Page v-if="pageTotal!==0" :current="currentPage" @on-change="pageChange" :total="pageTotal"
                      :page-size="pageSize"/>
            </Col>
        </Row>


        <!--    /**添加成员的模态框*/-->

        <Modal
                v-model="addUserModal"
                title="添加成员"
                :mask-closable="false"
                :loading="true"
                @on-visible-change="onAddUserModalChange">
            <label for="addUsers">成员名称:</label>
            <Input id="addUsers" class="btn_col" @on-change="addInputChange" v-model="addUserName" style="width: 270px;"
                   placeholder="请输入成员名称"/>
            <br>
            <label for="selectTeam">选择团队:</label>
            <Select v-model="selectTeam" @on-change="selectTeamChange" class="btn_col" id="selectTeam"
                    placeholder="请选择团队"
                    style="width: 270px;">
                <Option v-for="item in selectTeamData" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>

            <template slot="footer">
                <Button type="info" :disabled="addDisable" @click="addUser">确定</Button>
            </template>
        </Modal>

        <!--    删除用户模态框-->
        <Modal
                v-model="delUserModal"
                title="确定要删除该用户吗"
                @on-ok="delUser"
                @on-cancel="delUserModal=false">
            <h2 style="text-align: center;">
                {{delUserName}}
            </h2>
        </Modal>


        <!--    loading-->
        <div class="demo-spin-container" v-if="loading">
            <Spin size="large"
                  style="width: 50px;height: 50px;position: absolute;top:50%;left: 50%; transform: translate(-50%,-50%);"></Spin>
        </div>


        <!--    绑定用户的模态框-->
        <Modal
                v-model="bindUserModal"
                title="管理员绑定的用户"
                @on-ok="bindUserOK"
                @on-cancel="bindUserModal=false">
            <div style="border-bottom: 1px solid #e9e9e9;padding-bottom:6px;margin-bottom:6px;">
                <Checkbox
                        :indeterminate="indeterminate"
                        :value="checkAll"
                        @click.prevent.native="handleCheckAll">全选
                </Checkbox>
            </div>
            <Row style="max-height: 500px;overflow-y: scroll;">
                <Col>
                    <CheckboxGroup v-model="bindUserList">
                        <div v-for="user in checkBoxDataList" style="margin: 10px 0">
                            <Checkbox :label="user.id">{{user.userName}}</Checkbox>
                        </div>
                        <br>
                    </CheckboxGroup>
                </Col>
            </Row>

        </Modal>

    </div>
</template>

<script>
    import ShowLog from "../ShowLog/showLog";

    export default {
        name: "User",
        data() {
            return {
                searchContent: '',/*搜索的绑定内容*/
                pageTotal: 0,/*总条数*/
                currentPage: 1,/*当前页码*/
                pageSize: 14, /**每页多少*/
                pageHandlerData: [], /**分页后的数据*/

                addUserModal: false, /**添加成员的模态框打开状态*/
                addUserName: '', /**添加成员名称*/
                addDisable: true,/*成员的按钮禁用*/

                delUserModal: false, /**删除用户模态框*/
                delUserName: '', /**删除用户的名称*/
                delUserID: '',/*删除用户的id*/

                selectTeamData: [], /**选择团队的数据*/
                selectTeam: '',/*选择团队绑定值*/

                bindUserModal: false, /**绑定 用户的模态框状态*/
                bindUserList: [], /**绑定用户的数据列表*/
                bindUserAdminID: '', /**绑定管理员的id*/
                indeterminate: true,
                checkAll: false,

                checkBoxDataList: [], /**多选框数据*/
                sysId: '', /**管理员id*/
                addUserShow: false,/*如果是超级管理员显示添加按钮*/


                loading: false,
                userHead: [
                    {
                        type: 'index',
                        align: 'center',
                        width: 80,
                        indexMethod: (cont) => {
                            return ((this.currentPage - 1) * this.pageSize) + cont._index + 1
                        }
                    },
                    {
                        title: '姓名',
                        key: 'userName',
                        align: 'center'
                    },
                    {
                        title: '所属团队',
                        key: 'teamName',
                        align: 'center'
                    },
                    {
                        title: '上周周报是否提交',
                        slot: 'notFinished',
                        align: 'center',

                    },
                    {
                        title: '操作',
                        slot: 'action',
                        width: 150,
                        align: 'center'
                    }
                ],
                userData: [],
            }


        },
        comments: {
            ShowLog
        },
        created() {
            this.getAdminID();
            this.getUserList();
            this.getBindUser()
            this.isAdmin()
        },
        methods: {
            /**获取用户列表*/
            getUserList(sysId = this.sysId + "") {
                this.$http.post('/api/user/get_user', {data: {sysId: sysId}}).then(res => {
                    let {data: {data: userList, respMsg}} = res
                    if (res.data['respCode'] === '200') {
                        let {total, list} = userList
                        this.pageTotal = total
                        this.userData = list.map(item => {
                            item['teamName'] = item['team']['name']
                            return item
                        })
                        this.pageHandlerData = this.userData
                    } else {
                        this.$Notice.error({
                            title: respMsg
                        })
                    }
                }).catch(err => {
                    if (err) {
                        console.log(err)
                        this.$Notice.error({
                            title: '服务器数据异常'
                        })
                    }
                })
            },

            /**模糊查询*/
            searchItem() {
                this.pageHandlerData = this.userData
                let reg = new RegExp(this.searchContent, 'i')
                this.pageHandlerData = this.pageHandlerData.filter(item => {
                    return reg.test(item.userName)
                })
                this.pageTotal = this.pageHandlerData.length
                this.currentPage = 1
            },

            /**添加用户*/
            addUser() {
                this.loading = true;
                this.$http.post('/api/user/add_user', {

                    data: {
                        userName: this.addUserName,
                        teamId: this.selectTeam
                    }
                }).then(res => {
                    if (res.data.respCode === '200') {
                        this.$Notice.info({
                            title: '添加用户成功'
                        })
                        this.addUserModal = false
                        this.loading = false
                        this.getUserList()
                    } else {
                        this.$Notice.error({
                            title: '添加失败'
                        })
                    }
                })
            },

            /**添加成员模态框状态改变*/
            onAddUserModalChange(status) {
                if (!status) {
                    this.addUserName = ''
                    this.selectTeam = ''
                }
            },

            /**添加成员选择团队点击事件*/

            selectTeamChange() {
                this.addDisable = false
            },

            /**添加成员的输入框事件*/
            addInputChange() {
                if (this.addUserName.trim() && this.selectTeam) {
                    this.addDisable = false
                } else {
                    this.addDisable = true
                }
            },


            /**打开添加成员的模态框*/
            addUserModalOpen() {
                this.addUserModal = true
                this.$http.post('/api/team/get_team', {}).then(res => {
                    if (res.data.respCode === '200') {
                        this.selectTeamData = res.data.data.map(item => {
                            return {
                                label: item.name,
                                value: item.id
                            }
                        })
                    } else {
                        this.$Notice.error({
                            title: '查询团队异常'
                        })
                    }
                })
            },

            /**删除指定用户*/

            removeUser(data) {
                let {id, userName} = data
                this.delUserName = userName
                this.delUserID = id + ""
                this.delUserModal = true
            },

            /**删除用户确定按钮*/
            delUser() {
                this.$http.post('/api/user/del_user', {data: {id: this.delUserID}}).then(res => {
                    if (res.data.respCode === '200') {
                        this.$Notice.info({
                            title: '删除用户成功'
                        })
                        this.getUserList()
                    } else {
                        this.$Notice.error({
                            title: '删除失败'
                        })
                    }
                })
            },

            /**页码的点击事件*/
            pageChange(page) {
                this.currentPage = page
            },

            /**绑定用户确定按钮*/
            bindUserOK() {
                let data = {
                    relation: this.bindUserList.join('_'),
                    id: this.bindUserAdminID
                }
                this.$http.post('/api/sys_user/add_sys_user', {data: data}).then(res => {
                    if (res.data.respCode === '200') {
                        this.updateAdminData()
                        this.$Notice.info({
                            title: '绑定成功'
                        })
                        this.getUserList();
                    }
                })
            },

            /**绑定用户的点击事件*/
            bindUserClick() {
                this.bindUserModal = true
                this.getCheckBoxList()
            },


            /**获取管理员的绑定成员*/
            getBindUser() {
                let admin = JSON.parse(window.localStorage.getItem('admin'))
                let {relation, id} = admin
                this.bindUserAdminID = id
                this.bindUserList = relation.split('_').map(item => Number(item))
            },

            /**绑定用户的全选事件*/
            handleCheckAll() {
                if (this.indeterminate) {
                    this.checkAll = false;
                } else {
                    this.checkAll = !this.checkAll;
                }
                this.indeterminate = false;

                if (this.checkAll) {
                    this.bindUserList = this.checkBoxDataList.map(item => item.id);
                } else {
                    this.bindUserList = [];
                }
            },


            /**更新登录管理的数据*/
            updateAdminData() {
                let admin = JSON.parse(window.localStorage.getItem('admin'))
                let {userName, passWord} = admin
                this.$http.post('/api/sys_user/login', {data: {userName, passWord}}).then(res => {
                    console.log(res)
                    if (res.data.respCode === '200') {
                        window.localStorage.setItem('admin', JSON.stringify(res.data.data))
                    }
                })
            },

            /**获取管理员id*/
            getAdminID() {
                let admin = JSON.parse(window.localStorage.getItem('admin'))
                let {id} = admin
                this.sysId = id
            },

            /**获取多选框的数据*/
            getCheckBoxList() {
                this.$http.post('/api/user/get_user', {data: {}}).then(res => {
                    let {data: {data: userList}, respMsg} = res
                    if (res.data['respCode'] === '200') {
                        let {total, list} = userList
                        this.checkBoxDataList = list.map(item => {
                            item['teamName'] = item['team']['name']
                            return item
                        })
                    } else {

                        this.$Notice.error({
                            title: '查询用户失败'
                        })
                    }
                }).catch(err => {
                    if (err) {
                        this.$Notice.error({
                            title: '服务器数据异常'
                        })
                    }
                })
            },

            /***判断是否是超级管理员*/
            isAdmin() {
                let admin = JSON.parse(window.localStorage.getItem('admin'))
                let {id} = admin
                if (id === 6666) {
                    this.addUserShow = true
                } else {
                    this.addUserShow = false
                }
            },


        }
    }
</script>

<style scoped>
    .btn_col {
        margin: 15px;
    }

    .demo-spin-container {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        background-color: #000;
        opacity: .5;
        bottom: 0;
        z-index: 999;
        text-align: center;
    }
</style>
