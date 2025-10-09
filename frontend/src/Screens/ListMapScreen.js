/*
가게를 지도에서 보여주는 화면

특정 가게의 위치를 카카오맵 WebView로 띄워줌.
*/

import React from 'react';
import { WebView } from 'react-native-webview';
import { StyleSheet, View, Text, SafeAreaView, Pressable, Platform, Dimensions, StatusBar, Linking} from 'react-native';
import { WHITE, PRIMARY, BACKCARROT } from "../Colors";
import config from "../config";


const { width } = Dimensions.get("window");
const isTablet = width >= 820;


const COLORS = {
  primary: PRIMARY?.DEFAULT || "#FF8A00",
  surface: "#FFFFFF",
  text: "#2F2F2F",
  sub: "#777",
  overlay: "rgba(255,255,255,0.95)",
};

const PlaceMapScreen = ({ route, navigation }) => {
  const { item } = route.params; // {name, address, lat, lng}

  // 외부 길찾기(카카오맵) 열기: 앱 스킴 → 실패시 웹
  const openKakaoNavi = async () => {
    const sp = ""; // 시작점 생략 시 현위치
    const ep = `${item.lat},${item.lng}`; // 위도,경도
    const name = encodeURIComponent(item.name);

    const appUrl = `kakaomap://route?ep=${ep}&by=FOOT&name=${name}`;
    const webUrl = `https://map.kakao.com/link/to/${name},${item.lat},${item.lng}`;
    try {
      const supported = await Linking.canOpenURL(appUrl);
      await Linking.openURL(supported ? appUrl : webUrl);
    } catch {
      Linking.openURL(webUrl);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />

      {/* 지도 */}
      <View style={StyleSheet.absoluteFill}>
        <WebView
          originWhitelist={["*"]}
          javaScriptEnabled
          domStorageEnabled
          // 여기서 '지도만' 렌더링 (검색창/상단바 없음)
          source={{
            html: `
              <!doctype html>
              <html lang="ko">
              <head>
                <meta charset="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
                <style>
                  html, body, #map { height: 100%; margin: 0; padding: 0; }
                </style>
                <script src="https://dapi.kakao.com/v2/maps/sdk.js?appkey=${config.KAKAO_JAVASCRIPT_KEY}&libraries=services"></script>
              </head>
              <body>
                <div id="map"></div>
                <script>
                  var mapContainer = document.getElementById('map');
                  var center = new kakao.maps.LatLng(${item.lat}, ${item.lng});
                  var map = new kakao.maps.Map(mapContainer, {
                    center: center,
                    level: 3
                  });

                  // 마커
                  var marker = new kakao.maps.Marker({ position: center, map: map });

                  // 심플 인포윈도우 (클릭 없이 항상 오픈 X)
                  var iw = new kakao.maps.InfoWindow({
                    position: center,
                    content: '<div style="padding:6px 8px;font-size:12px;border-radius:8px;">${item.name.replace(/'/g,"&#39;")}</div>'
                  });
                  iw.open(map, marker);

                  // 컨트롤(줌만 최소)
                  var zoomControl = new kakao.maps.ZoomControl();
                  map.addControl(zoomControl, kakao.maps.ControlPosition.RIGHT);

                  // 스크롤/드래그 허용
                  map.setDraggable(true);
                  map.setZoomable(true);
                </script>
              </body>
              </html>
            `,
          }}
          // 외부 링크는 우리가 버튼으로만 여니, 내부 네비게이션 차단 권장
          onShouldStartLoadWithRequest={(req) => {
            // kakao에서 내부적으로 불러오는 리소스는 허용
            if (req.url.startsWith("http") || req.url.startsWith("https")) return true;
            return false;
          }}
        />
      </View>

      {/* 좌상단 투명 뒤로가기 */}
      <Pressable style={styles.backFab} onPress={() => navigation.goBack()}>
        <Text style={{ fontSize: 18 }}>←</Text>
      </Pressable>

      {/* 하단 정보 카드 + 길찾기 */}
      <View style={styles.bottomCard}>
        <View style={styles.handle} />
        <Text style={styles.title}>{item.name}</Text>
        <Text style={styles.address}>{item.address}</Text>

        <View style={styles.row}>
          <Pressable style={styles.ctaPrimary} onPress={openKakaoNavi}>
            <Text style={styles.ctaPrimaryText}>길찾기</Text>
          </Pressable>
          <Pressable style={styles.ctaGhost} onPress={() => navigation.goBack()}>
            <Text style={styles.ctaGhostText}>닫기</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#FFF6EF" },

  backFab: {
    position: "absolute",
    top: Platform.OS === "android" ? 28 : 48,
    left: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.85)",
    alignItems: "center",
    justifyContent: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    zIndex: 10,
  },

  bottomCard: {
    position: "absolute",
    left: 16,
    right: 16,
    bottom: 24,
    backgroundColor: COLORS.overlay,
    borderRadius: 22,
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 16,
    elevation: 10,
    shadowColor: "#000",
    shadowOpacity: 0.18,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
  },
  handle: {
    alignSelf: "center",
    width: 44,
    height: 5,
    borderRadius: 3,
    backgroundColor: "#D9D9D9",
    marginBottom: 8,
  },
  title: { fontSize: 18, fontWeight: "800", color: COLORS.text, textAlign: "center" },
  address: {
    fontSize: 13,
    color: COLORS.sub,
    textAlign: "center",
    marginTop: 6,
    marginBottom: 12,
  },

  row: { flexDirection: "row", gap: 10, justifyContent: "center" },
  ctaPrimary: {
    flexGrow: 1,
    backgroundColor: COLORS.primary,
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: "center",
  },
  ctaPrimaryText: { color: "#fff", fontWeight: "800" },
  ctaGhost: {
    flexGrow: 1,
    backgroundColor: "#fff",
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#eee",
  },
  ctaGhostText: { color: COLORS.text, fontWeight: "700" },
});

export default PlaceMapScreen;