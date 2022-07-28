<template>
  <div class="detail">
    <el-card>
      <el-collapse v-model="activeNames">
        <el-collapse-item title="基础信息" name="1">
          <div class="main">
            <div class="baseInfo">
              <el-row>
                <el-col :span="6">
                  <p>货主编号</p>
                  <span>{{ goodsOwnerList.code }}</span>
                </el-col>
                <el-col :span="6">
                  <p>货主名称</p>
                  <span>{{ goodsOwnerList.name }}</span>
                </el-col>
                <el-col :span="6">
                  <p>联系人</p>
                  <span>{{ goodsOwnerList.personName }}</span>
                </el-col>
                <el-col :span="6">
                  <p>联系人电话</p>
                  <span>{{ goodsOwnerList.phone }}</span>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="6">
                  <p>联系人邮箱</p>
                  <span>{{ goodsOwnerList.email }}</span>
                </el-col>
                <el-col :span="6">
                  <p>省/市/区</p>
                  <span>{{ goodsOwnerList.location }}</span>
                </el-col>
                <el-col :span="6">
                  <p>详细地址</p>
                  <span>{{ goodsOwnerList.address }}</span>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="6">
                  <p>备注</p>
                  <span>{{ goodsOwnerList.remark || "暂无" }}</span>
                </el-col>
              </el-row>
            </div>
          </div>
        </el-collapse-item>
      </el-collapse>
    </el-card>
    <el-card style="margin-top: 20px">
      <el-collapse>
        <el-collapse-item title="库位信息">
          <div class="infoTip">
            总计：{{ total }}个库位 {{ goodsTotal }}个 货品
          </div>
          <!--   表格区域   -->
          <el-table
            :data="tableData"
            :header-cell-style="{
              'text-align': 'center',
              'background-color': '#f9f6ee',
            }"
            :cell-style="{
              'text-align': 'center',
              padding: '6px',
              'font-size': '13px',
            }"
            border
            style="width: 100%"
          >
            <el-table-column
              type="index"
              width="50"
              label="序号"
            ></el-table-column>
            <el-table-column
              prop="warehouseName"
              label="仓库名称"
            ></el-table-column>
            <el-table-column prop="areaName" label="库区名称"></el-table-column>
            <el-table-column
              prop="locationCode"
              label="库位编号"
            ></el-table-column>
            <el-table-column
              prop="locationName"
              label="库位名称"
            ></el-table-column>
          </el-table>
          <!--   分页   -->
          <el-row type="flex" style="margin-top: 20px" justify="center">
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="queryList.current"
              :page-sizes="[5, 10, 30, 40]"
              :page-size="queryList.size"
              layout="total, sizes, prev, pager, next, jumper"
              :total="total"
            >
            </el-pagination>
          </el-row>
        </el-collapse-item>
      </el-collapse>
    </el-card>
  </div>
</template>

<script>
import {
  queryGoodsOwner,
  queryOwnerAssociativeTableLocation,
} from "@/api/goods-owner";

export default {
  name: "detail",
  data() {
    return {
      activeNames: ["1"],
      tableData: [],
      total: 0,
      goodsTotal: 0,
      goodsOwnerList: [],
      queryList: {
        current: 1,
        size: 10,
        ownerId: this.$route.params.id,
      },
    };
  },
  created() {
    this.queryGoodsOwner();
    this.queryOwnerAssociativeTableLocation();
  },
  methods: {
    async queryGoodsOwner() {
      console.log(this.$route);
      const { data } = await queryGoodsOwner(this.$route.params.id);
      this.goodsOwnerList = data.data;
      this.goodsTotal = data.data.goodsTotal;
    },
    async queryOwnerAssociativeTableLocation() {
      const { data } = await queryOwnerAssociativeTableLocation(this.queryList);
      this.tableData = data.data.records;
      this.total = data.data.total - 0;
    },
    handleCurrentChange(newPage) {
      this.queryList.current = newPage;
      this.queryOwnerAssociativeTableLocation();
    },
    handleSizeChange(newSize) {
      this.queryList.size = newSize;
      this.queryOwnerAssociativeTableLocation();
    },
  },
};
</script>

<style lang="less" scoped>
.main {
  padding: 20px 0 0;

  .baseInfo {
    background: #fdfcf9;
    border: 1px solid #f7f2f1;
    padding: 25px 30px;
  }
}

.infoTip {
  display: inline-block;
  height: 32px;
  line-height: 30px;
  background: #fff9eb;
  border: 1px solid #ffb200;
  padding: 0 25px;
  margin: 20px 0;
}
</style>
