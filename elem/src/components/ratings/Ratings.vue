<template>
  <div class="ratings" ref="ratinghook">
    <!--用于BScroll-->
    <div class="ratings-content">
      <div class="overview">
        <div class="overview-left">
          <h1 class="score"> {{ seller.score }}</h1>
          <div class="title">综合评分</div>
          <div class="rank">高于周边商家 {{seller.rankRate}}%</div>
        </div>
        <div class="overview-right">
          <div class="score-wrapper">
            <span class="title">服务态度</span>
            <star :size="36" :score="seller.serviceScore"></star>
            <span class="score">{{ seller.serviceScore }}</span>
          </div> 
          <div class="score-wrapper">
            <span class="title">服务态度</span>
            <star :size="36" :score="seller.foodScore"></star>
            <span class="score">{{ seller.foodScore }}</span>
          </div>
          <div>
          <div class="delivery-wrapper">
            <span class="title">送达时间</span>
            <span class="delivery">{{ seller.deliveryTime }}</span>
          </div>
        </div>
        </div>
      </div>
      <split></split>
      <ratingselect @select="changeType" @toggleContent="changeOnlyContent" :selectType="selectType" :onlyContent="onlyContent" :ratings="ratings"></ratingselect>
      <div class="rating-wrapper">
        <ul>
          <li v-for="rating in ratings" class="rating-item border-1px" v-show="needShow(rating.rateType,rating.text)">
            <div class="avatar">
              <img :src="rating.avatar" width="28" height="28">
            </div>
            <div class="content">
              <h1 class="name"> {{rating.username }} </h1>
              <div class="star-wrapper">
                <star :size="24" :score="rating.score" class="star"></star>
                <span class="delivery" v-show="rating.deliveryTime">{{rating.deliveryTime}}分钟送达</span>
              </div>
              <p class="text">{{rating.text}}</p>
              <div class="recommend" v-show="rating.recommend && rating.recommend.length">
                  <span class="icon-thumb_up"></span>
                  <span v-for="item in rating.recommend" class="border-1px recommend-item"> {{ item }} </span>
              </div>
              <div class="time"> {{rating.rateTime | formatDate}} </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
  import star from '../star/Star'
  import split from '../split/split'
  import ratingselect from '../ratingselect/ratingselect'
  import BScroll from 'better-scroll'
  const ALL = 2,
        POSITIVE = 0,
        NEGATIVE = 1;
  const ERR_OK = 0;
  export default {
    props: {
      seller: {
        type: Object
      }
    },
    data() {
      return {
        ratings: [],
        selectType: ALL,
        onlyContent: true,

      }
    },
    components: {
      star,
      split,
      ratingselect
    },
    created() {
      this.$http.get('/api/ratings').then((res) => {
        res = res.body;
        if(res.errno === ERR_OK) {
          this.ratings = res.data;
          this.$nextTick(()=> {
            this.scroll = new BScroll(this.$refs.ratinghook, {
              click: true
            })
          });
        }
      });
    },
    methods: {
      changeType(type) {
        this.selectType = type;
        this.scroll.refresh();
      },
      changeOnlyContent(isonlyType) {
        this.onlyContent = isonlyType;
        this.scroll.refresh();
      },
      needShow(type, text) {
        if(this.onlyContent && !text) {
          return false;
        }
        if(this.selectType === ALL) {
          return true;
        }
        if(this.selectType === type) {
          return true;
        }
        return false;
      }
    }
  }
</script>
<style lang="stylus">
@import '../../common/stylus/mixin.styl'
  .ratings
    position absolute
    top 174px
    bottom 0
    left 0
    width 100%
    overflow hidden
    .overview
      display flex 
      padding 18px 0
      .overview-left
        padding 6px 0
        flex 0 0 137px
        width 137px
        border-right 1px solid rgba(7, 17, 27, 0.1)
        text-align center
        @media only screen and (max-width: 320px)
          flex 0 0 120px
          width 120px
        .score
          margin-bottom 6px
          line-height 28px
          font-size 24px
          color rgb(255, 153, 0)
        .title
          margin-bottom 8px
          line-height 12px
          font-size 12px
          font-weight 700
          color  rgb(7, 17, 27)
        .rank
         
          line-height 10px
          font-size 10px
          color  rgb(147, 153, 159)
      .overview-right
        flex 1
        padding 6px 0 24px 6px
        .score-wrapper
           margin-bottom 8px   
           line-height 18px
           font-size 0
           .title
             display inline-block
             vertical-align top
             font-size 12px
             color rgb(7, 17, 27)       
           .star
             display inline-block
             vertical-align top
             margin 0 12px
           .score
             display inline-block
             vertical-align top
             font-size 12px 
             color rgb(255, 153, 0)
        .delivery-wrapper
          font-size 0
          .title
             line-height 18px
             font-size 12px
             color rgb(7, 17, 27)s
          .delivery
            margin-left 12px
            line-height 18px
            font-size 12px
            color rgb(147, 153, 159)
    .rating-wrapper
      padding 0 18px  
      .rating-item
        display flex
        padding 18px 0
        border-1px(rgba(7, 17, 27, 0.1))
        .avatar
          display inline-block
          flex 0 0 28px
          vertical-align top
          width 28px
          margin-right  12px
          img
            border-radius 50%
        .content
          display inline-block
          flex 1
          vertical-align top
          .name
            line-height 12px
            font-size 12px
            margin 0 0 4px 0
            color rgb(7, 17, 27)
          .star-wrapper
            .star
              display inline-block
              vertical-align top
              margin 0 6px 8px 0          
            .delivery
              display inline-block
              vertical-align top
              font-size 10px
              font-weight 100
              color rgb(147, 153, 159)
          .text 
            margin-bottom 8px
            line-height 18px
            font-size 12px
            font-weight 200
            color rgb(7, 17, 27)
          .recommend
            line-height 16px
            font-size 0
            color rgb(147, 153, 159)
            background-color rgb(255, 255, 255)
            .icon-thumb_up, .recommend-item
              line-height 16px
              margin 0 8px 4px 0
            .icon-thumb_up
              font-size 12px
              color rgb(0, 160, 200)
            .recommend-item
              padding 0 6px
              font-size 9px
              border 1px solid rgba(7, 17, 27, 0.1)
              border-radius 1px
          .time
            position absolute
            top 18px
            right 0px
            line-height 12px
            font-size 10px
            color rgb(147, 153, 159)
             

</style>

