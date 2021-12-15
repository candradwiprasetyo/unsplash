<script lang="ts">
import Vue from "vue";
import InfiniteScroll from "v-infinite-scroll";
Vue.use(InfiniteScroll);

export default {
  name: "Homepage",
  data() {
    return {
      collectionId: 3403106,
      dataCollection: [],
      filter: false,
      page: 1,
      items: [],
      limit: 50,
      loading: false,
      loadingSearch: false,
      search: "",
      orderBy: "relevant",
      color: "",
      orientation: "",
      selectedImage: "",
      filterColor: [
        { value: "black", label: "Black", color: "black", active: false },
        { value: "white", label: "White", color: "white", active: false },
        { value: "yellow", label: "yellow", color: "yellow", active: false },
        { value: "orange", label: "orange", color: "orange", active: false },
        { value: "red", label: "red", color: "red", active: false },
        { value: "purple", label: "purple", color: "purple", active: false },
        { value: "magenta", label: "magenta", color: "magenta", active: false },
        { value: "green", label: "green", color: "green", active: false },
        { value: "teal", label: "teal", color: "teal", active: false },
        { value: "blue", label: "blue", color: "blue", active: false },
      ],
      filterOrientation: [
        { value: "landscape", label: "landscape", active: false },
        { value: "portrait", label: "portrait", active: false },
        { value: "squarish", label: "squarish", active: false },
      ],
    };
  },
  methods: {
    toggleFilter() {
      this.filter = !this.filter;
    },
    nextPage() {
      ++this.page;
      this.loadData();
    },
    loadData(clearData = false) {
      if (clearData) {
        this.dataCollection = [];
      }
      this.loading = true;
      this.$axios
        .get(
          "/collections/" +
            this.collectionId +
            "/photos?per_page=" +
            this.limit +
            "&page=" +
            this.page +
            "&order_by=" +
            this.orderBy
        )
        .then((res) => {
          this.dataCollection = this.dataCollection.concat(res.data);
          this.loading = false;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    goSearch() {
      this.loadingSearch = true;
      this.dataCollection = [];

      let paramColor = "";
      if (this.color != "") {
        paramColor = "&color=" + this.color;
      }

      let paramOrientation = "";
      if (this.orientation != "") {
        paramOrientation = "&orientation=" + this.orientation;
      }

      this.$axios
        .get(
          "/search/photos?collections=" +
            this.collectionId +
            "&per_page=" +
            this.limit +
            "&page=" +
            this.page +
            "&query=" +
            this.search +
            "&order_by=" +
            this.orderBy +
            paramColor +
            paramOrientation
        )
        .then((res) => {
          this.dataCollection = res.data.results;
          this.loadingSearch = false;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    filterChanged() {
      this.page = 1;
      this.goSearch();
    },
    closeFilter() {
      this.filter = false;
    },
    pickColor(index) {
      let oldVal = this.filterColor[index].active;
      this.filterColor.forEach((element) => {
        element.active = false;
      });
      if (oldVal) {
        this.color = "";
      } else {
        this.color = this.filterColor[index].value;
      }
      this.filterColor[index].active = !oldVal;
      this.goSearch();
    },
    pickOrientation(index) {
      let oldVal = this.filterOrientation[index].active;
      this.filterOrientation.forEach((element) => {
        element.active = false;
      });
      if (oldVal) {
        this.orientation = "";
      } else {
        this.orientation = this.filterOrientation[index].value;
      }
      this.filterOrientation[index].active = !oldVal;
      this.goSearch();
    },
    viewImage(img) {
      this.selectedImage = img;
    },
    closeImage() {
      this.selectedImage = null;
    },
  },
  mounted() {
    this.loadData(true);
  },
  watch: {
    orderBy: function (val) {
      this.filterChanged();
    },
  },
};
</script>

<template>
  <div>
    <div class="fixed py-5 w-full bg-gray-800 z-40">
      <div class="container mx-auto p-5">
        <div class="flex space-x-6">
          <div class="flex-grow">
            <div class="rounded-full w-full bg-gray-900">
              <img
                src="~/assets/images/search.png"
                width="20"
                class="inline-block ml-4"
              />
              <input
                type="text"
                class="
                  pl-3
                  w-1/2
                  md:w-11/12
                  inline-block
                  p-3
                  outline-none
                  bg-transparent
                  text-white
                "
                placeholder="Search"
                v-model="search"
                @change="filterChanged"
              />
            </div>
          </div>
          <div class="flex-none">
            <div
              @click="toggleFilter"
              class="
                text-white
                py-3
                px-6
                bg-blue-500
                rounded-full
                w-auto
                lg:w-40
                outline-none
                text-center
                cursor-pointer
                font-bold
              "
            >
              <span class="hidden md:inline">Filter</span>
              <img
                src="~/assets/images/filter.png"
                width="20"
                class="inline-block inline md:hidden"
              />
            </div>
          </div>
        </div>

        <div
          class="w-full bg-gray-900 text-white p-8 mt-5 rounded-2xl text-sm"
          v-if="filter"
        >
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8 lg:grid-cols-4">
            <div>
              <div class="font-bold mb-2">SORT BY</div>
              <div>
                <input
                  type="radio"
                  v-model="orderBy"
                  value="relevant"
                  id="relevance"
                />
                <label for="relevance">Relevance</label>
              </div>
              <div>
                <input
                  type="radio"
                  v-model="orderBy"
                  value="latest"
                  id="newest"
                />
                <label for="newest">Newest</label>
              </div>
            </div>
            <div>
              <div class="font-bold mb-2">COLOR</div>
              <div class="relative">
                <div
                  v-for="(dataColor, index) in filterColor"
                  :key="index"
                  class="
                    h-6
                    w-6
                    inline-block
                    rounded-full
                    bg-gray-400
                    mx-2
                    my-1
                    cursor-pointer
                  "
                  :class="dataColor.active ? 'border-2 border-gray-300' : ''"
                  :style="'background: ' + dataColor.color"
                  @click="pickColor(index)"
                ></div>
              </div>
            </div>
            <div>
              <div class="font-bold mb-2">ORIENTATION</div>
              <div class="relative">
                <div
                  v-for="(dataOrientation, index) in filterOrientation"
                  :key="index"
                  class="inline-block mx-2 my-1 cursor-pointer rounded"
                  :class=""
                  :class="
                    dataOrientation.active
                      ? 'border-2 border-gray-200 bg-gray-700'
                      : 'border-2 border-transparent bg-gray-800'
                  "
                  @click="pickOrientation(index)"
                >
                  <div
                    :class="
                      dataOrientation.value == 'portrait'
                        ? 'h-10 w-6'
                        : dataOrientation.value == 'landscape'
                        ? 'w-10 h-6'
                        : dataOrientation.value == 'squarish'
                        ? 'h-8 w-8'
                        : ''
                    "
                  ></div>
                </div>
              </div>
            </div>
            <div class="text-right flex flex-row-reverse items-stretch">
              <div
                class="
                  justify-self-end
                  self-end
                  text-white
                  py-3
                  px-6
                  bg-gray-600
                  rounded-full
                  outline-none
                  text-center
                  cursor-pointer
                  text-sm
                  w-40
                "
                @click="closeFilter"
              >
                CLEAR FILTERS
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="h-16"></div>

    <v-infinite-scroll
      :loading="loading"
      @bottom="nextPage"
      :offset="20"
      style="max-height: 90vh; overflow-y: auto"
      v-if="dataCollection.length > 0"
    >
      <div
        class="
          p-5
          container
          mx-auto
          grid grid-cols-2
          md:grid-cols-3
          lg:grid-cols-6
          gap-8
          mt-12
        "
      >
        <div
          class="
            rounded-xl
            h-4/5 h-32
            overflow-hidden
            cursor-pointer
            opacity-50
            hover:opacity-100
          "
          v-for="(data, index) in dataCollection"
          :key="index"
          @click="viewImage(data.urls.regular)"
        >
          <img :src="data.urls.thumb" width="100%" class="rounded-xl" />
        </div>
      </div>
      <div class="text-white font-bold pb-5 text-center w-full" v-if="loading">
        Loading...
      </div>
    </v-infinite-scroll>

    <div
      class="w-full text-white text-center mt-20"
      v-if="dataCollection.length == 0 && loadingSearch == false"
    >
      Data not found
      <img
        src="~/assets/images/data-not-found.png"
        class="mx-auto"
        alt="Data not found"
      />
    </div>

    <div class="w-full text-white text-center mt-20" v-if="loadingSearch">
      Loading...
    </div>

    <div
      class="
        fixed
        inset-0
        bg-gray-800
        z-50
        flex
        h-screen
        justify-center
        items-center
      "
      v-if="selectedImage"
    >
      <div class="relative h-screen">
        <div
          @click="closeImage"
          class="absolute top-0 cursor-pointer right-0 m-2"
        >
          <div class="bg-gray-800 text-white font-bold p-3 rounded-lg">
            Close
          </div>
        </div>
        <img :src="selectedImage" class="rounded-xl h-screen" />
      </div>
    </div>
  </div>
</template>

