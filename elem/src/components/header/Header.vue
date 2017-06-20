<template>
  <div id="app-header">
      <div class="content-wrap">
        <div class="avatar">
          <img :src="seller.avatar" width="64" height="64">
        </div>
        <div class="content">
          <div class="title">
            <span class="brand"></span>
            <span class="name" > {{ seller.name }}</span>
          </div>
          <div class="description">
            {{ seller.description }}/ {{ seller.deliveryTime }}分钟送达
          </div>
          <div class="support" v-if="seller.supports">
            <span class="icon" :class="classMap[seller.supports[0].type]"></span>
            <span class="text"> {{ seller.supports[0].description }} </span>
          </div>
        </div>
        <div v-if="seller.supports" class="support-count" @click="showDetail"> 
            <span class="count"> {{ seller.supports.length }}个 </span>
            <i class="icon-keyboard_arrow_right" ></i>
         </div>
      </div>
      <div class="bulletin-wrap" @click="showDetail">
          <span class="bulletin-brand"></span><span class="bulletin-text" v-if="seller.bulletin"> {{ seller.bulletin }} </span>
          <i class="icon-keyboard_arrow_right" ></i>
      </div>
      <div class="background">
        <img :src="seller.avatar" width="100%" height="100%">
      </div>
      <transition name="fade">
          <div class="detail" v-show = "detailShow" >
          <!--sticky-footer -->
       
              <div class="detail-wrap clearfix">
                <div class="detail-main">
                  <h1 class="name"> {{ seller.name }} </h1>
                  <div class="star-wrap">
                    <star :score = "seller.score" :size="48"></star>
                  </div>
                  <div class="title">
                    <div class="line"></div>
                    <div class="text">优惠信息</div>
                    <div class="line"></div>
                  </div>
                  <ul v-if="seller.supports" class="supports">
                    <li class="support-item" v-for="item in seller.supports">
                        <span class="icon" :class="classMap[item.type]">  </span>
                        <span class="text"> {{ item.description }} </span>
                    </li>
                  </ul>
                  <div class="title">
                    <div class="line"></div>
                    <div class="text">商家公告</div>
                    <div class="line"></div>
                  </div>
                  <div class="bulletin"> 
                    <span>{{ seller.bulletin }} </span>
                  </div>
                </div>
              </div>
              <div class="detail-close" @click = "closeDetail">
                <i class="icon-close"></i>
              </div>

          </div>
      </transition>
  </div>
</template>

<script>
import star from '../star/Star'
export default {
  name: 'app-header',
  data() {
    return {
      detailShow: false
    }
  },
  props: {
    seller: {
      type: Object
    }
  },
  methods: {
    showDetail: function() {
      this.detailShow = true;
    },
    closeDetail: function() {
      this.detailShow = false;
    }
  },
  created() {
    this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee']
  },
  components: {
    star
  }
}
</script>

<style lang = "stylus">
  @import "../../common/stylus/mixin.styl";

  #app-header 
    position: relative
    color: #fff
    background-color: rgba(7, 17, 27, 0.5)
    .content-wrap 
      position: relative
      padding: 24px 12px 18px 24px
      // avatar和content之间会自动有缝隙，是空白字符 font-size为0 用来消除
      font-size: 0
      .avatar 
        display: inline-block
        vertical-align: top
        img 
          border-radius: 2px
      .content
        display: inline-block
      
        margin-left: 16px
        .title
           margin: 2px 0 8px 0
           .brand 
              display: inline-block
              vertical-align: top
              width: 30px
              height: 18px
              bg-image('brand')
              background-size: 30px 18px
              background-repeat: no-repeat
            .name 
              margin-left: 6px
              font-size: 16px
              font-weight: bold
              line-height: 18px
        .description
              margin-bottom: 10px
              line-height: 12px
              font-size: 12px
              font-weight: 100
        .support
              margin-bottom: 2px
              
              .icon 
                  display: inline-block
                  vertical-align: top
                  width: 12px
                  height: 12px
                  margin-right: 4px
                  background-size: 12px 12px
                  background-repeat: no-repeat
                  &.decrease
                    bg-image('decrease_1')
                  &.discount
                    bg-image('discount_1')
                  &.guarantee
                    bg-image('guarantee_1')
                  &.invoice 
                    bg-image('invoice_1')
                  &.special 
                    bg-image('special_1')
              .text
                line-height: 12px
                font-size: 10px
      .support-count
          position: absolute
          padding: 7px 8px
          right: 12px
          bottom: 14px
          height: 24px
          line-height: 24px
          font-weight: 100
          border-radius: 14px
          background-color: rgba(0, 0, 0, 0.2)
          text-align: center
          .count

            font-size: 10px
          .icon-keyboard_arrow_right
            font-size: 10px
            line-height: 24px
            margin-left: 2px
    .bulletin-wrap
      position: relative
      padding: 0 22px 0 12px
      height: 28px
      line-height: 28px
      white-space: nowrap
      overflow: hidden
      text-overflow: ellipsis
      //导致省略号消失
      // font-size: 0
      background-color: rgba(7, 17, 27, 0.2)
      .bulletin-brand
        display: inline-block
        vertical-align: top
        margin-top: 8px
        width: 22px
        height: 12px
        bg-image('bulletin')
        background-size: 22px 12px
        background-repeat: no-repeat
      .bulletin-text
        line-height: 28px
        vertical-align: top
        margin: 0 4px
        font-size: 10px
        font-weight: 100
        
      .icon-keyboard_arrow_right
        position: absolute
        right: 12px
        top: 9px
        font-size: 10px
    .background 
      position: absolute
      top: 0
      left: 0
      width: 100%
      height: 100%
      z-index: -1
      filter:blur(10px)
    .detail
      position: fixed
      top: 0
      left: 0
      z-index: 100
      width: 100%
      height: 100%
      overflow: auto
      // transition: all 0.5s
      background: rgba(7, 17, 27, 0.8)
      backdrop-filter: blur(10px)
      &.fade-enter-active, &.fade-leave-active 
        transition: all 0.5s
      
      &.fade-enter, &.fade-leave-active 
        opacity: 0
        background: rgba(7, 17, 27, 0.8)

      .detail-wrap
        min-height: 100%
        width: 100%
        .detail-main 
          margin-top: 64px
          padding-bottom: 64px
          .name 
            line-height: 16px
            text-align: center
            font-size: 16px
            font-weight: 700
          .star-wrap
            text-align: center
            margin-top: 16px
            padding: 2px 0
          .title
            display: flex
            width: 80%
            margin: 28px auto 24px auto
            .line
              flex: 1
              position: relative
              top: -6px
              border-bottom: 1px solid rgba(255, 255, 255, 0.2)
            .text 
              padding: 0 12px
          .supports
            width: 80%
            margin:0 auto
            .support-item
              padding: 0 12px
              .icon 
                    display: inline-block
                    // vertical-align: top
                    width: 16px
                    height: 16px
                    margin-right: 6px
                    background-size: 16px 16px
                    background-repeat: no-repeat
                    &.decrease
                      bg-image('decrease_2')
                    &.discount
                      bg-image('discount_2')
                    &.guarantee
                      bg-image('guarantee_2')
                    &.invoice 
                      bg-image('invoice_2')
                    &.special 
                      bg-image('special_2')
              .text 
                display: inline-block
                vertical-align: top
                line-height: 12px
                font-size: 12px
                font-weight: 200
          .bulletin
            width: 80%
            margin: 0 auto
            span
              display: inline-block
              padding: 0 12px
              line-height: 24px
              font-size: 12px
              font-weight: 200


      .detail-close
        position: relative  
        width: 32px
        height: 32px
        margin: -64px auto 0 auto
        font-size: 32px
        clear: both
        
          
        

</style>
