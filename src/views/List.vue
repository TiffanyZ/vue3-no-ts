<template>
  <div class="home-list">
    <div class="oper">
      <a-button type="primary" @click="changeOper">管理员</a-button>
    </div>
    <!-- 按照栏目展示 -->
    <a-menu v-model:selectedKeys="data.current" mode="horizontal">
      <a-menu-item v-for="(item, i) in data.columnData" :key="i" :value="item.id" @click="changeTab"><mail-outlined />{{item.name}} </a-menu-item>
    </a-menu>
    <a-spin :spinning="data.spinning">
      <a-table bordered :data-source="data.homeList" :columns="base.columns" :pagination="data.paginationSet" @change="tableChange">
        <template v-slot:desc="{ text, record }">
          <a-button type="primary" @click="showDrawer(text, record)">click</a-button>
          <a-drawer
            :title="data.drawerTitle"
            placement="right"
            :width="700"
            :closable="false"
            v-model:visible="data.drawerVisible"
          >
            <div v-html="data.drawerContent"></div>
          </a-drawer>
        </template>
        <template v-slot:img="{ text }">
          <img alt="example" style="width: 100%" :src="text ? base.imgUrl + text : base.defaultImg" @click="previewFunc(text)" />
        </template>
        <template v-slot:operation="{ text, record }">
          <a-popconfirm
            title="Sure to recall?"
            @confirm="onRecall(record.key, record, text)"
            v-if="data.operName"
          >
            <a>Recall</a>
          </a-popconfirm>&nbsp;&nbsp;
        </template>
      </a-table>
    </a-spin>
    <!-- 预览 -->
    <a-modal :visible="data.previewVisible" :footer="null" @cancel="handleCancel">
      <img alt="img" style="width: 100%" :src="data.previewImage" />
    </a-modal>
    <!-- czy -->
    <a-modal
      :visible="data.czyVisible"
      title="管理员编号"
      ok-text="确认"
      cancel-text="取消"
      @ok="czyConfirm"
      @cancel="czyCancel"
    >
      <a-form
        ref="operForm"
        :model="data.operForm"
        :label-col="allbase.labelCol"
        :wrapper-col="allbase.wrapperCol"
      >
        <a-form-item label="confirm code" required name="code">
          <a-input v-model:value="data.operForm.code" placeholder="code" />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>
<script>
import { reactive, onMounted } from "vue";
import { listParam, allParam } from "../common/param";
import { getHomeList, getColumnList, backColumnList, getOper } from "../services/api";
import { MailOutlined } from '@ant-design/icons-vue';
export default {
  name: "List",
  components: {
    MailOutlined
  },
  setup() {
    const base = reactive(listParam);
    const allbase = reactive(allParam);
    let data = reactive({
      homeList: [],
      columnData: [],
      current: [0],
      spinning: true,
      paginationSet: {
        pageSize: 5,
        total: 0,
        current: 1
      },
      currentColumn: "",
      drawerVisible: false,
      drawerContent: "",
      drawerTitle: "",
      previewVisible: false,
      previewImage: "",
      czyVisible: false,
      operForm: {
        code: ""
      },
      operName: ""
    });

    onMounted(() => {
      getColumnFunc();
    });

    // 获取栏目
    function getColumnFunc() {
      getColumnList({}).then(res => {
        data.columnData = res.data || [];
        if (res.data && res.data.length > 0) {
          data.currentColumn = res.data[0].id;
          getListFunc();
        }
      });
    }

    // 获取list
    function getListFunc() {
      data.homeList = [];
      data.spinning = true;
      getHomeList({
        id: data.currentColumn,
        page_no: data.paginationSet.current,
        page_size: data.paginationSet.pageSize
      }).then(res => {
        if (res && res.type === "columnList") {
          let allArr = res.data || [];
          if (allArr.length > 0) {
            allArr.map(item => {
              item.key = item.id;
              item.tag = item.tag ? JSON.parse(item.tag) : "";
            });
          }
          data.homeList = allArr;
          data.paginationSet.total = res.total || 0;
          data.spinning = false;
        }
      });
    }

    function changeTab(i) { // item,key
      data.currentColumn = i.item.value;
      data.paginationSet.current = 1;
      getListFunc();
    }
    // 分页
    function tableChange(i) {
      data.paginationSet.current = i.current;
      getListFunc();
    }

    // 撤回
    function onRecall(i, j) { // key==id
      backColumnList({
        key: i,
        column: j.column,
        img: j.img,
        oper_name: data.operName || ""
      }).then(() => {
        console.log('ts')
        data.paginationSet.current = 1;
        getListFunc();
      });
    }

    // 内容展开抽屉
    function showDrawer(i, j) {
      data.drawerVisible = true;
      data.drawerContent = i;
      data.drawerTitle = j.title || "desc"
    }

    // 打开预览
    function previewFunc(i) {
      data.previewImage = i ? base.imgUrl + i : base.defaultImg;
      data.previewVisible = true;
    }

    // 预览关闭
    function handleCancel() {
      data.previewVisible = false;
    }

    // czy
    function changeOper() {
      data.czyVisible = true;
      data.operForm.code = "";
    }
    function czyConfirm() {
      getOper({
        code: data.operForm.code || ""
      }).then(res => {
        console.log(res);
        data.operName = res || "";
        czyCancel();
      });
    }
    function czyCancel() {
      data.czyVisible = false;
      data.code = "";
    }

    return {
      base,
      allbase,
      data,
      changeTab,
      tableChange,
      onRecall,
      showDrawer,
      handleCancel,
      previewFunc,
      changeOper,
      czyConfirm
    };
  }
};
</script>
<style lang="less" rel="stylesheet/less">
@import "../assets/less/list.less";
</style>
