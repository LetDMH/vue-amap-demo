<template>
    <div class="amap">
        <h3>vue-amap-demo</h3>
        <div id="vue-amap-container"></div>
    </div>
</template>

<script>
import { lazyAMapApiLoaderInstance } from 'vue-amap';
let marker = ''
export default {
    data(){
        return {
            map: {},
            markers: [],
            selectedData: {}, // 已选地址和坐标,
            selectedAdd: '', // 已选地址
        }
    },
    created(){
        this.initMap()
    },
    beforeDestroy () {
        this.map.destroy()
    },
    methods:{
        initMap(){
            lazyAMapApiLoaderInstance.load().then(() => {
                this.map = new AMap.Map('vue-amap-container', {
                    resizeEnable: true,
                    zoom: 13
                })
                this.map.plugin('AMap.Geolocation',()=>{
                    const geolocation = new AMap.Geolocation({
                        // 是否使用高精度定位，默认:true
                        enableHighAccuracy: true,
                        // 超过10秒后停止定位，默认：无穷大
                        timeout: 10000,
                        // 定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
                        buttonOffset: new window.AMap.Pixel(10, 20),
                        showMarker: false, // 不显示定位点
                        // 定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
                        zoomToAccuracy: true,
                        buttonPosition: 'RB'
                    })
                    this.map.addControl(geolocation)
                    geolocation.getCurrentPosition()
                    AMap.event.addListener(geolocation, 'complete', this.onComplete) // 返回定位信息
                })
                AMap.event.addListener(this.map, 'click', this.getPosition) // 为地图绑定点击事件
            })
        },
        // 获取鼠标点击的坐标
        getPosition (e) {
            let x = e.lnglat.lng
            let y = e.lnglat.lat
            let lnglatXY = [x, y]
            this.regeocoder(lnglatXY)
        },
        // 解析定位结果
        onComplete (data) {
            this.map.setZoom(13)
            let x = data.position.lng
            let y = data.position.lat
            let lnglatXY = [x, y]
            this.regeocoder(lnglatXY)
        },
        // 逆地理编码
        regeocoder (lnglatXY) {
            this.map.plugin('AMap.Geocoder', () => {
                let geocoder = new AMap.Geocoder({
                    radius: 1000,
                    extensions: 'all'
                })
                geocoder.getAddress(lnglatXY, (status, result) => {
                    if (status === 'complete' && result.info === 'OK') {
                        this.geocoder_Addresss(result.regeocode.addressComponent)
                    }
                })

                // 添加marker
                this.addMarker(lnglatXY)

                // 储存已选坐标
                this.selectedData.location = {lon: lnglatXY[0], lat: lnglatXY[1]}
            })
        },
        // 添加marker
        addMarker (lnglatXY) {
            // 清空已有marker
            if (marker) {
                marker.setMap(null)
                marker = null
            }

            // 向地图添加marker
            marker = new AMap.Marker({
                position: lnglatXY,
                offset: {x: -8, y: -34}
            })
            marker.setMap(this.map)
        },
        // 返回定位的地址
        geocoder_Addresss (addressComponent) {
            let province = addressComponent.province
            let city = addressComponent.city
            let district = addressComponent.district
            let address = addressComponent.township + addressComponent.street + addressComponent.streetNumber
            this.selectedAdd = province + city + district + address
            this.selectedData.province = province
            this.selectedData.city = city || province // 直辖市或特别行政区这一栏为空，用省份代替
            this.selectedData.district = district
            this.selectedData.address = address
            console.log(addressComponent,marker)
            console.log(this.selectedAdd,this.selectedData)
        },
    }
}
</script>

<style>
h3 {
    text-align: center;
}
.amap-container {
    height: 500px;
    width: 700px;
    margin: 0 auto;
}
</style>