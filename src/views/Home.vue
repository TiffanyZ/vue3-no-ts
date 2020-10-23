<template>
  <div class="home">
    <!-- :rules="base.rules" -->
    <a-form
      ref="homeForm"
      :model="state"
      :label-col="base.labelCol"
      :wrapper-col="base.wrapperCol"
    >
      <a-form-item label="Activity title" required name="title">
        <a-input v-model:value="state.title" placeholder="title" />
      </a-form-item>
      <!-- <a-form-item label="Activity desc" name="desc" required>
        <a-textarea
          v-model:value="state.desc"
          :auto-size="{ minRows: 5 }"
          allow-clear
          placeholder="desc"
        />
      </a-form-item>-->
      <a-form-item label="Activity column" required name="column">
        <a-select
          v-model:value="state.column"
          placeholder="please select your column"
        >
          <a-select-option
            v-for="(pro, c) in data.columnData"
            :key="c"
            :value="pro.id"
            >{{ pro.name }}</a-select-option
          >
        </a-select>
      </a-form-item>
      <a-form-item label="Activity time" required name="time">
        <a-date-picker
          v-model:value="state.time"
          format="YYYY-MM-DD HH:mm:ss"
          type="date"
          placeholder="Pick a date"
          style="width: 100%;"
          @change="timeChange"
        />
      </a-form-item>
      <a-form-item label="Activity tag" name="tag">
        <a-checkbox-group v-model:value="state.tag" :options="data.tagData" />
      </a-form-item>
      <!-- 图片上传 -->
      <a-form-item label="Activity img" name="img">
        <a-upload-dragger
          name="file"
          :multiple="false"
          :action="data.acitonUrl"
          enctype="multipart/form-data"
          method="POST"
          target="_blank"
          @preview="handlePreview"
          @change="imgChangeFunc"
        >
          <p class="ant-upload-drag-icon">
            <inbox-outlined />
          </p>
          <p class="ant-upload-text">
            Click or drag file to this area to upload
          </p>
          <p class="ant-upload-hint">
            Multiple uploads are subject to the last one
          </p>
        </a-upload-dragger>
      </a-form-item>
      <a-form-item label="Activity name">
        <a-input v-model:value="state.name" placeholder="name" />
      </a-form-item>
      <a-form-item label="Activity link">
        <a-input v-model:value="state.link" placeholder="link" />
      </a-form-item>
      <!-- required -->
      <a-form-item label="Activity desc" name="desc">
        <div id="wangeditor">
          <div id="editorElem" style="text-align:left;"></div>
        </div>
      </a-form-item>
      <a-form-item class="form-center" :wrapper-col="{ span: 18 }">
        <a-button type="primary" @click="onSubmitFunc">Create</a-button>
        <a-button style="margin-left: 10px;" @click="resetFormFunc"
          >Reset</a-button
        >
      </a-form-item>
    </a-form>
    <a-modal v-model:visible="data.visible" title="提示" @ok="handleOk">
      <p>{{ data.visibleText }}</p>
    </a-modal>
    <!-- 预览 -->
    <a-modal
      :visible="data.previewVisible"
      :footer="null"
      @cancel="handleCancel"
    >
      <img alt="img" style="width: 100%" :src="data.previewImage" />
    </a-modal>
  </div>
</template>

<script>
import { reactive, onMounted, getCurrentInstance } from "vue";
import { homeParam, editSetParam } from "../common/param";
import { InboxOutlined } from "@ant-design/icons-vue";
import {
  getIdData,
  getTagList,
  getColumnList,
  addHomeData,
  resetId,
  saveDraft,
  getDraft
} from "../services/api";
// import { getIdData } from "../services/api";
// import { formatDate } from "../common/index"
import E from "wangeditor"; // 富文本
import xss from "xss";

export default {
  name: "Home",
  components: {
    InboxOutlined
  },
  setup() {
    //显示当前路径(用ctx的话，打包后你就会发现用不了，挂载的属性都没了,建议不要使用)
    const { ctx } = getCurrentInstance();
    // ctx.$message.success("this is message");
    // console.log(ctx.$router.currentRoute.value.path);
    console.log(ctx);

    const base = reactive(homeParam);
    let state = reactive({
      id: "",
      title: "",
      name: "",
      column: "",
      time: null,
      desc: "",
      link: "",
      img: "",
      tag: ""
    });
    let data = reactive({
      homeList: [],
      columnData: [], // 栏目
      tagData: [], // 标签
      visible: false,
      visibleType: "", // 区分error
      visibleText: "",
      acitonUrl: "",
      editor: null,
      content: "", // 富文本内容
      previewVisible: false,
      previewImage: ""
    });

    onMounted(() => {
      getDraftFunc();
      getTagFunc();
      getColumnFunc();
      getIdFunc();
    });

    function getDraftFunc() {
      getDraft().then(res => {
        console.log(res);
        data.content = res.data || '';
        initEdit();
      });
    }

    function initEdit() {
      data.editor = new E(document.getElementById("editorElem"));
      // 自定义编辑区域z-index
      data.editor.config.zIndex = editSetParam.zIndex;
      // 编辑器的事件，每次改变会获取其html内容
      data.editor.config.onchange = html => {
        console.log('change');
        // state.desc = html;
        data.content = html;
      };
      // 插入网络图片校验
      data.editor.config.linkImgCallback = url => {
        console.log(url); // url 即插入图片的地址
        return true; // 返回 true 表示校验成功
      };
      // 插入链接校验
      data.editor.config.linkImgCallback = (text, link) => {
        console.log(text); // 插入的文字
        console.log(link); // 插入的链接
        return true; // 返回 true 表示校验成功
      };
      data.editor.config.emotions = editSetParam.emotions;
      data.editor.config.menus = editSetParam.menus;
      // 注册新菜单(保存草稿)
      const { BtnMenu } = E.menuConstructors
      class SaveMenu extends BtnMenu {
        constructor(editor) {
          const $elem = E.$(
            `<div class="w-e-menu">
                <button style="border: none; background: none; cursor: pointer; outline: none;">save</button>
            </div>`
          );
          super($elem, editor);
        }
        // 菜单点击事件
        clickHandler() {
          // 保存草稿
          saveDraft({
            content: data.content || ""
          }).then(res => {
            console.log(res);
          });
        }
        // 菜单是否被激活（如果不需要，这个函数可以空着）
        // 1. 激活是什么？光标放在一段加粗、下划线的文本时，菜单栏里的 B 和 U 被激活，如下图
        // 2. 什么时候执行这个函数？每次编辑器区域的选区变化（如鼠标操作、键盘操作等），都会触发各个菜单的 tryChangeActive 函数，重新计算菜单的激活状态
        tryChangeActive() {
          // 激活菜单
          // 1. 菜单 DOM 节点会增加一个 .w-e-active 的 css class
          // 2. this.this.isActive === true
          // this.active();

          // // 取消激活菜单
          // // 1. 菜单 DOM 节点会删掉 .w-e-active
          // // 2. this.this.isActive === false
          // this.unActive()
        }
      }
      const menuKey = "saveMenuKey"; // 菜单 key ，各个菜单不能重复
      data.editor.menus.extend("saveMenuKey", SaveMenu); // 将菜单加入到 editor.config.menus 中
      data.editor.config.menus = data.editor.config.menus.concat(menuKey);

      data.editor.create(); // 创建富文本实例
      if (data.content) {
        data.editor.txt.html(data.content) // 初始化草稿
      }
    }

    function getTagFunc() {
      getTagList({}).then(res => {
        data.tagData = res.data || [];
      });
    }

    function getColumnFunc() {
      getColumnList({}).then(res => {
        data.columnData = res.data || [];
      });
    }

    function getIdFunc(i) {
      getIdData({}).then(res => {
        let lastId = "";
        if (res && res.type === "homeId") {
          lastId = res.data || "";
        }
        state.id = lastId || lastId === 0 ? parseFloat(lastId) + 1 : "";
        data.acitonUrl = base.aciton + state.id;
        if (i && i === "save") {
          saveFunc();
        }
      });
    }

    // 图片上传
    function imgChangeFunc(val) {
      const status = val.file.status;
      if (status === "done") {
        state.img = val.file.response;
        console.log("上传成功！");
      }
    }

    // 提交
    function onSubmitFunc() {
      // 手动校验
      if (!state.title) {
        comErr("请输入标题");
        return;
      }
      if (!data.content) {
        comErr("请输入内容");
        return;
      }
      if (!state.column) {
        comErr("请选择栏目");
        return;
      }
      if (!state.time) {
        comErr("请选择时间");
        return;
      }
      // xss过滤内容
      state.desc = xss(data.content);
      state.name = state.name === "" ? "匿名" : state.name;
      state.tag =
        state.tag && state.tag.length > 0 ? JSON.stringify(state.tag) : "";
      getIdDataFunc();
      // 自动校验（ctx打包后挂载不上）
      // ctx.$refs.homeForm.validate().then(() => {
      //     state.name = state.name === "" ? "匿名" : state.name;
      //     state.tag = state.tag && state.tag.length > 0 ? JSON.stringify(state.tag) : "";
      //     getIdDataFunc();
      //   })
      //   .catch(error => {
      //     console.log('error', error);
      //   });
    }
    // 提交报错
    function comErr(i) {
      data.visibleType = "error";
      data.visibleText = i;
      data.visible = true;
    }
    // 保存前获取已有homeId
    function getIdDataFunc() {
      if (!state.id) {
        getIdFunc("save");
      } else {
        saveFunc();
      }
    }
    // 保存（add）
    function saveFunc() {
      addHomeData(state).then(() => {
        data.visibleType = "";
        data.visibleText = "上传成功！";
        data.visible = true;
        resetFormFunc();
        resetIdFunc();
      });
    }
    // 重置
    function resetFormFunc() {
      // ctx.$refs.homeForm.resetFields();
      state.title = "";
      state.name = "";
      state.column = "";
      state.time = null;
      state.desc = "";
      state.link = "";
      state.img = "";
      state.tag = "";
      data.editor.txt.clear(); // 清空编辑器
      resetDraft(); // 重置草稿
    }
    // 更新lastId
    function resetIdFunc() {
      resetId({
        id: state.id
      }).then(() => {
        getIdFunc();
      });
    }
    // 重置草稿
    function resetDraft() {
      saveDraft({
        content: ""
      }).then(res => {
        console.log(res);
      })
    }

    // 时间框选择
    function timeChange(time, str) {
      state.time = null;
      state.time = str;
    }

    // 关闭弹框
    function handleOk() {
      data.visible = false;
    }
    // 图片预览
    async function handlePreview(file) {
      if (!file.url && !file.preview) {
        file.preview = await getBase64(file.originFileObj);
      }
      data.previewImage = file.url || file.preview;
      data.previewVisible = true;
    }
    // 预览关闭
    function handleCancel() {
      data.previewVisible = false;
    }

    function getBase64(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
      });
    }

    return {
      state,
      base,
      data,
      onSubmitFunc,
      resetFormFunc,
      imgChangeFunc,
      timeChange,
      handleOk,
      handlePreview,
      handleCancel
    };
  }
};
</script>
<style lang="less" rel="stylesheet/less">
@import "../assets/less/home.less";
</style>
