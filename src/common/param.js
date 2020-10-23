const comStatic = "http://www.sttsg.com/noeditor/app/static/"; // edit
const postUrl = "http://www.sttsg.com/edit/"; // edit
const emjUrl = "http://www.sttsg.com/noeditor/app/static/emoji/"; // edit

export const param = {
  postUrl: postUrl
};

export const homeParam = {
  labelCol: { span: 6 },
  wrapperCol: { span: 12 },
  aciton: postUrl + "upload?id=",
  rules: {
    title: [
      {
        required: true,
        message: "Please input Activity title",
        trigger: "blur"
      },
      { min: 3, max: 15, message: "Length should be 3 to 15", trigger: "blur" }
    ],
    desc: [
      {
        required: true,
        message: "Please input Activity title",
        trigger: "blur"
      }
    ],
    column: [
      {
        required: true,
        message: "Please select activity column",
        trigger: "change"
      }
    ],
    time: [
      {
        required: true,
        message: "Please select activity column",
        trigger: "change"
      }
    ]
  }
};

export const allParam = {
  imgUrl: comStatic + "img/allImg/",
  defaultImg: comStatic + "img/allImg/" + "default-img.png",
  columns: [
    {
      title: "id",
      dataIndex: "id",
      width: "10%",
      align: "center"
    },
    {
      title: "title",
      dataIndex: "title",
      align: "center",
      ellipsis: true
    },
    {
      title: "desc",
      dataIndex: "desc",
      align: "center",
      slots: { customRender: "desc" }
    },
    {
      title: "time",
      width: "15%",
      dataIndex: "time",
      align: "center"
    },
    {
      title: "img",
      width: "10%",
      dataIndex: "img",
      align: "center",
      slots: { customRender: "img" }
    },
    {
      title: "operation",
      width: "15%",
      dataIndex: "operation",
      slots: { customRender: "operation" }
    }
  ],
  labelCol: { span: 6 },
  wrapperCol: { span: 16 },
  rules: {
    column: [
      {
        required: true,
        message: "Please select activity column",
        trigger: "change"
      }
    ],
    name: [
      {
        required: true,
        message: "Please input Activity name",
        trigger: "blur"
      },
      {
        min: 3,
        max: 10,
        message: "Length should be 3 to 5",
        trigger: "blur"
      }
    ]
  }
};

export const listParam = {
  imgUrl: comStatic + "img/listImg/",
  defaultImg: comStatic + "img/listImg/" + "default-img.png",
  columns: [
    {
      title: "id",
      dataIndex: "id",
      width: "10%",
      align: "center"
    },
    {
      title: "title",
      dataIndex: "title",
      align: "center",
      ellipsis: true
    },
    {
      title: "desc",
      dataIndex: "desc",
      align: "center",
      slots: { customRender: "desc" }
    },
    {
      title: "time",
      width: "15%",
      dataIndex: "time",
      align: "center"
    },
    {
      title: "img",
      width: "10%",
      dataIndex: "img",
      align: "center",
      slots: { customRender: "img" }
    },
    {
      title: "checkTime",
      width: "15%",
      dataIndex: "check_time",
      align: "center"
    },
    {
      title: "checkName",
      dataIndex: "check_name",
      align: "center"
    },
    {
      title: "operation",
      width: "15%",
      dataIndex: "operation",
      slots: { customRender: "operation" }
    }
  ]
};

export const editSetParam = {
  menus: [
    // 菜单配置
    "head", // 标题
    "bold", // 粗体
    "fontSize", // 字号
    "fontName", // 字体
    "italic", // 斜体
    "underline", // 下划线
    "strikeThrough", // 删除线
    "foreColor", // 文字颜色
    "backColor", // 背景颜色
    "link", // 插入链接
    "list", // 列表
    "justify", // 对齐方式
    "quote", // 引用
    "emoticon", // 表情
    "image", // 插入图片
    "table", // 表格
    "code", // 插入代码
    "undo", // 撤销
    "redo" // 重复
  ],
  emotions: [
    {
      title: "custom", // tab 的标题
      type: "image", // 'emoji' 或 'image' ，即 emoji 形式或者图片形式
      content: [
        { alt: "[咧嘴]", src: emjUrl + "emj1.png", width: "10", height: "10" },
        { alt: "[龇牙]", src: emjUrl + "emj2.png" },
        { alt: "[尴尬]", src: emjUrl + "emj3.png" },
        { alt: "[微笑]", src: emjUrl + "emj4.png" },
        { alt: "[笑哭]", src: emjUrl + "emj5.png" },
        { alt: "[捂嘴]", src: emjUrl + "emj6.png" },
        { alt: "[瞑目]", src: emjUrl + "emj7.png" },
        { alt: "[难过]", src: emjUrl + "emj8.png" },
        { alt: "[思考]", src: emjUrl + "emj9.png" },
        { alt: "[惊讶]", src: emjUrl + "emj10.png" },
        { alt: "[愤怒]", src: emjUrl + "emj11.png" },
        { alt: "[脸红]", src: emjUrl + "emj12.png" },
        { alt: "[流泪]", src: emjUrl + "emj13.png" },
        { alt: "[生气]", src: emjUrl + "emj14.png" },
        { alt: "[十分愤怒]", src: emjUrl + "emj15.png" },
        { alt: "[捂脸]", src: emjUrl + "emj16.png" },
        { alt: "[嘴唇]", src: emjUrl + "emj17.png" },
        { alt: "[爆炸]", src: emjUrl + "emj18.png" },
        { alt: "[么么]", src: emjUrl + "emj19.png" },
        { alt: "[发烧]", src: emjUrl + "emj20.png" },
        { alt: "[感冒]", src: emjUrl + "emj21.png" },
        { alt: "[嬉皮]", src: emjUrl + "emj22.png" },
        { alt: "[无语]", src: emjUrl + "emj23.png" },
        { alt: "[天使]", src: emjUrl + "emj24.png" },
        { alt: "[想一想]", src: emjUrl + "emj25.png" },
        { alt: "[嘘嘘]", src: emjUrl + "emj26.png" },
        { alt: "[睡觉]", src: emjUrl + "emj27.png" },
        { alt: "[见钱眼开]", src: emjUrl + "emj28.png" },
        { alt: "[心心眼]", src: emjUrl + "emj29.png" },
        { alt: "[星星眼]", src: emjUrl + "emj30.png" },
        { alt: "[白眼]", src: emjUrl + "emj31.png" },
        { alt: "[大便]", src: emjUrl + "emj32.png" },
        { alt: "[握手]", src: emjUrl + "emj33.png" },
        { alt: "[拜拜]", src: emjUrl + "emj34.png" },
        { alt: "[手]", src: emjUrl + "emj35.png" },
        { alt: "[OK]", src: emjUrl + "emj36.png" },
        { alt: "[耶]", src: emjUrl + "emj37.png" },
        { alt: "[好运]", src: emjUrl + "emj38.png" },
        { alt: "[666]", src: emjUrl + "emj39.png" },
        { alt: "[骷髅]", src: emjUrl + "emj40.png" },
        { alt: "[爱心]", src: emjUrl + "emj41.png" },
        { alt: "[心碎]", src: emjUrl + "emj42.png" }
      ]
    },
    {
      title: "emoji", // tab 的标题
      type: "emoji", // 'emoji' / 'image'
      // emoji 表情，content 是一个数组即可
      content: "😀 😃 😄 😁 😆 😅 😂 😊 😇 🙂 🙃 😉 😓 😪 😴 🙄 🤔 😬 🤐".split(
        /\s/
      )
    }
  ],
  zIndex: 2
};
