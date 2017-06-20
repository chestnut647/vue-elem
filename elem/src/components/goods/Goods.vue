<template>
  <div id="app-goods">
      <div class="menu-wrap" ref="menuwrap">
        <ul>
          <li v-for="(item, index ) in goods" class="menu-item border-1px" :class="{active: currentIndex === index}" @click="seclectMenu(index, $event)">
             <span class="text">
                <span v-show="item.type>0" class="icon" :class="classMap[item.type]"></span>
                {{ item.name }}
             </span>
          </li>
        </ul>
      </div>
      <div class="foods-wrap" ref="foodwrap">
        <ul>
            <li v-for="item in goods" class="food-list food-list-hook">
              <h1 class="title"> {{ item.name }} </h1>
              <ul>
                <li @click="selectFood(food, $event)" v-for="food in item.foods" class="food-item border-1px">
                    <div class="icon">
                      <img :src="food.icon" width="57px">
                    </div>
                    <div class="content">
                      <h2 class="name">  {{ food.name }} </h2>
                      <div class="desc" v-show="food.description"> {{ food.description }} </div>
                      <div class="extra">
                        <span class="count">月售{{ food.sellCount }}份</span><span>好评率 {{ food.rating }}% </span>
                      </div>
                      <div class="price">
                        <span class="now"> ￥{{ food.price }} </span>
                        <span class="old" v-show="food.oldPrice"> {{ food.oldPrice }} </span>
                      </div>
                      <div class="control-wrapper">
                        <cartcontrol :food="food" @add="drop"></cartcontrol>
                      </div>
                    </div>

                </li>
              </ul>
            </li>
        </ul>
      </div>
      <shopcart ref="shopcart" :delivery-price = "seller.deliveryPrice" :min-price = "seller.minPrice" :selectedFoods="selectedFoods"></shopcart>
      <food :food="selectedFood" ref="food" @add="drop"></food>
  </div>
</template>

<script>
  import BScroll from 'better-scroll';
  import shopcart from '../shopcart/Shopcart';
  import cartcontrol from '../cartcontrol/cartcontrol';
  import food from '../food/food'
  const ERR_OK = 0;
  export default {
    name: 'app-goods',
    data() {
      return {
        goods: [],
        listHeight: [],
        scrollY: 0,
        selectedFood: {}
      }
    },
    props: {
      seller: {
        tyle: Object
      }
    },
    components: {
      shopcart,
      cartcontrol,
      food
    },
    created() {
       this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee'];
       this.$http.get('/api/goods').then(response => {
        // success callback
        response = response.body;
        if(response.errno === ERR_OK) {
            this.goods = response.data;
            this.$nextTick(function() {
              this._initScroll();
              this._calculateHeight();
       
            });
        }
      }); 
    },
    methods: {
      _initScroll() {
            this.meunScroll = new BScroll(this.$refs.menuwrap, {
                click: true
            });
            this.foodScroll = new BScroll(this.$refs.foodwrap, {
                click: true,
                probeType: 3
            });
            this.foodScroll.on('scroll', (pos)=> {
              this.scrollY = Math.abs(Math.round(pos.y));
               
            })
      },
      _calculateHeight() {
          let foodList = this.$refs.foodwrap.getElementsByClassName('food-list-hook');
          let height = 0;
          this.listHeight.push(height);
          for(var i=0; i<foodList.length; i++) {
            let item = foodList[i];
            height += item.clientHeight;
            this.listHeight.push(height);
          }
      },
      seclectMenu (index,event) {
//      自己默认派发事件时候(BScroll),_constructed被置为true,但是浏览器原生并没有这个属性
        if(!event._constructed) {
            return;
        }
        let foodList = this.$refs.foodwrap.getElementsByClassName('food-list-hook');
        let el = foodList[index];
        this.foodScroll.scrollToElement(el, 600)
      },
      drop(target) {
        // 体验优化
        
         this.$nextTick(()=> {
            this.$refs.shopcart.drop(target);
         })
      },
      selectFood(food, event) {
        if(!event._constructed) {
            return;
        }
        this.selectedFood = food;
        this.$refs.food.show();
      }
    },
    computed: {
      currentIndex: function() {
        for(var i=0; i < this.listHeight.length; i++) {
          let height1 = this.listHeight[i];
          let height2 = this.listHeight[i+1];
          if( this.scrollY >= height1 && this.scrollY < height2) {
            return i;
          }
        }
        return 0;
      },
      selectedFoods: function() {
        let foods = [];
        this.goods.forEach ( function(good) {
          good.foods.forEach ( function(food) {
            if(food.count) {
              foods.push(food);
            }
          });
        });
        return foods;
      }
    }
  }
</script>

<style lang="stylus" >
@import "../../common/stylus/mixin.styl"
  #app-goods
    display: flex
    position: absolute
    top: 174px
    bottom: 46px
    width: 100%
    overflow: hidden
    // font-size: 0
    .menu-wrap
      flex: 0 0 80px
      width: 80px
      background: #f3f5f7
      .menu-item
        display: table
        padding: 0 12px
        height: 54px
        width: 56px
        line-height: 14px
        font-size: 12px
        border-1px(rgba(7, 17, 27, 0.1))
        &.active
          position: relative
          margin-top: -1px
          z-index: 10
          line-height: 14px
          font-size: 12px
          font-weight: 700
          
          background-color: white
          .text
            border-none()
        .text
          display: table-cell
          width: 56px
          vertical-align: middle
          font-size: 12px
          
        .icon 
            display: inline-block
            vertical-align: top
            width: 12px
            height: 12px
            margin-right: 2px
            background-size: 12px 12px
            background-repeat: no-repeat
            &.decrease
              bg-image('decrease_3')
            &.discount
              bg-image('discount_3')
            &.guarantee
              bg-image('guarantee_3')
            &.invoice 
              bg-image('invoice_3')
            &.special 
              bg-image('special_3')
    .foods-wrap
      flex: 1
      width 300px
      .food-list
        .title 
          margin: 0 0 18px 0
          padding-left: 14px
          height: 26px
          line-height: 26px
          border-left: 1px solid #d9dde1
          font-size: 12px
          color: rgb(147, 153, 159)
          background: #f3f5f7
        .food-item
          display: flex
          padding-bottom: 18px
          margin: 18px
          border-1px(rgba(7, 17, 27, 0.1))
          &:last-child
            border-none() 
            margin-bottom: 0
          .icon
            flex: 0 0 57px
            margin-right: 10px
          .content
            flex: 1
            .name
              margin: 2px 0 8px
              font-size: 14px
              height: 14px
              line-height: 14px
              color: rgb(7, 17, 27)
            .desc, .extra
              font-size: 10px
              height: 10px
              line-height: 10px
              white-space:nowrap
              overflow:hidden          
              text-overflow:ellipsis
              color: rgb(147, 153, 159)
            .desc
              margin: 0 0 8px 0s
            .extra
              overflow: hidden
              
              .count
                margin-right: 12px
                
            .price
                font-weight: 700
                line-height: 24px
              .now
                margin-right: 8px
                font-size: 14px
                color: rgb(240, 20, 20)
              .old 
                text-decoration: line-through
                font-size: 10px
                color: rgb(147, 153, 159)
            .control-wrapper
              position: absolute
              right: 0
              bottom: 12px
             
           

</style>
