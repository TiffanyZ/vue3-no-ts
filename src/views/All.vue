<template>
  <div class="home-all">
    <div class="oper">
      <a-button type="primary" @click="changeOper">管理员</a-button>
    </div>
    <a-spin :spinning="data.spinning">
      <a-table
        bordered
        :data-source="data.homeList"
        :columns="base.columns"
        :pagination="data.paginationSet"
        @change="tableChange"
      >
        <template v-slot:desc="{ text, record }">
          <a-button type="primary" @click="showDrawer(text, record)"
            >click</a-button
          >
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
          <img
            alt="img"
            style="width: 100%"
            :src="text ? base.imgUrl + text : base.defaultImg"
            @click="previewFunc(text)"
          />
        </template>
        <template v-slot:operation="{ text, record, index }">
          <a-popconfirm
            v-if="
              data.operName && data.homeList.length &&
                !(index === 0 && data.paginationSet.current === 1)
            "
            title="Sure to delete?"
            @confirm="onDelete(record.key, record, text)"
          >
            <a>Delete</a> </a-popconfirm
          >&nbsp;&nbsp;
          <a-popconfirm
            v-if="
              data.operName && data.homeList.length &&
                !(index === 0 && data.paginationSet.current === 1)
            "
            title="Sure to pass?"
            @confirm="onPass(record.key, record, text)"
          >
            <a>Pass</a>
          </a-popconfirm>
        </template>
      </a-table>
    </a-spin>

    <a-modal
      v-model:visible="data.visible"
      title="栏目选择"
      ok-text="确认"
      cancel-text="取消"
      @ok="confirmModal"
    >
      <!-- :rules="base.rules" -->
      <a-form
        ref="passForm"
        :model="data.passForm"
        :label-col="base.labelCol"
        :wrapper-col="base.wrapperCol"
      >
        <a-form-item label="confirm column" required name="column">
          <a-radio-group
            v-model:value="data.passForm.column"
            @change="changeColumn"
          >
            <a-radio
              v-for="(item, i) in data.columnData"
              :key="i"
              :value="item.id"
              >{{ item.name }}</a-radio
            >
          </a-radio-group>
        </a-form-item>
        <a-form-item label="confirm name" required name="name">
          <a-input v-model:value="data.passForm.name" placeholder="name" />
        </a-form-item>
      </a-form>

      <!-- <a-checkbox-group v-model:value="data.column" :options="data.columnData" @change="changeColumn" /> -->
    </a-modal>
    <!-- 预览 -->
    <a-modal
      :visible="data.previewVisible"
      :footer="null"
      @cancel="handleCancel"
    >
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
        :label-col="base.labelCol"
        :wrapper-col="base.wrapperCol"
      >
        <a-form-item label="confirm code" required name="code">
          <a-input v-model:value="data.operForm.code" placeholder="code" />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>
<script>
import { reactive, onMounted, getCurrentInstance } from "vue";
import { allParam } from "../common/param";
import { formatDate } from "../common/index";
import {
  getHomeAll,
  delHomeData,
  addHomeList,
  getColumnList,
  getOper
} from "../services/api";

export default {
  name: "All",
  components: {},
  setup() {
    //显示当前路径
    const { ctx } = getCurrentInstance();
    console.log(ctx);
    // console.log(ctx.$router.currentRoute.value.path);
    const base = reactive(allParam);
    let data = reactive({
      homeList: [],
      editingKey: "",
      cacheData: [],
      visible: false,
      currentObj: {},
      columnData: [], // 栏目
      passForm: {
        column: "",
        name: ""
      },
      spinning: true,
      paginationSet: { pageSize: 5, total: 0, current: 1 },
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
      init();
    });

    function init() {
      getHomeAllFunc();
      getColumnFunc();
    }

    // 栏目
    function getColumnFunc() {
      getColumnList({}).then(res => {
        data.columnData = res.data || [];
      });
    }

    function getHomeAllFunc() {
      data.spinning = true;
      getHomeAll({
        page_no: data.paginationSet.current,
        page_size: data.paginationSet.pageSize
      }).then(res => {
        if (res && res.type === "homeAll") {
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
          data.cacheData = allArr.map(item => ({ ...item }));
        }
      });
    }

    function onDelete(i, j) {
      // key=id
      let obj = {
        id: i,
        img: j ? j.img : "",
        type: j ? "del" : "",
        oper_name: data.operName || ""
      };
      delHomeData(obj).then(() => {
        data.currentObj = {};
        data.paginationSet.current = 1;
        getHomeAllFunc();
      });
    }

    // 通过确认
    function onPass(i, j) {
      if (!data.operName) {
        return;
      }
      j.check_time = formatDate(new Date());
      data.passForm.column = j.column;
      data.currentObj = j;
      data.visible = true;
    }

    // 重置分类
    function changeColumn(e) {
      data.currentObj.column = parseFloat(e.target.value);
    }

    // 审核通过确认
    function confirmModal() {
      // 手动校验
      if (!data.passForm.column) {
        console.log("请选择栏目");
        return;
      }
      if (!data.passForm.name) {
        console.log("请输入名称");
        return;
      }
      data.currentObj.check_name = data.passForm.name || "";
      data.currentObj.oper_name = data.operName || "";
      if (data.passForm.column && data.passForm.name && data.currentObj.oper_name) {
        // 分栏目保存&删除
        addHomeList(data.currentObj).then(() => {
          data.visible = false;
          onDelete(data.currentObj.id);
        });
      } else {
        console.log("err");
      }
      // 自动校验
      // ctx.$refs.passForm
      //   .validate()
      //   .then(() => {
      //     data.currentObj.check_name = data.passForm.name || '';
      //     if (data.passForm.column && data.passForm.name) {
      //       // 分栏目保存&删除
      //       addHomeList(data.currentObj).then(() => {
      //         data.visible = false;
      //         onDelete(data.currentObj.id);
      //       });
      //     } else {
      //       console.log("err");
      //     }
      //   })
      //   .catch(error => {
      //     console.log("error", error);
      //   });
    }

    // 分页
    function tableChange(i) {
      data.paginationSet.current = i.current;
      getHomeAllFunc();
    }

    // 内容展开抽屉
    function showDrawer(i, j) {
      data.drawerVisible = true;
      data.drawerContent = i;
      data.drawerTitle = j.title || "desc";
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
      data,
      onDelete,
      onPass,
      confirmModal,
      changeColumn,
      tableChange,
      showDrawer,
      previewFunc,
      handleCancel,
      czyCancel,
      czyConfirm,
      changeOper
    };
  }
};
</script>
<style lang="less" rel="stylesheet/less">
@import "../assets/less/all.less";
</style>
