/* 장소를 검색하고 및 추가하는 스크린(실제 지도 화면 띄워진다) */

import React, { useState, useRef } from "react";
import { SafeAreaView, View, Text, TextInput, StyleSheet, Keyboard, FlatList, TouchableOpacity, Pressable,  StatusBar, Platform, Dimensions } from "react-native";
import { WebView } from "react-native-webview";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import config from "../config";
import { useUserState } from "../Contexts/UserContext";


const { width } = Dimensions.get("window");
const isTablet = width >= 820;

const COLORS = {
  bg: "#FFF6EF",
  surface: "#FFFFFF",
  primary: "#FF8A00",
  text: "#2F2F2F",
  sub: "#7A7A7A",
  line: "#EEE",
  overlay: "rgba(255,255,255,0.92)",
};


const MapScreen = () => {
  const navigation = useNavigation();
  const webViewRef = useRef(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]); // 검색 결과 목록
  const [selectedPlace, setSelectedPlace] = useState(null); // 사용자가 목록에서 '선택'한 장소 하나
  const [user] = useUserState();

  // Kakao API 요청 함수 Kakao 키워드 검색
  const fetchKakaoAddress = async (query) => {
    Keyboard.dismiss();

    if (!query) return;

    try {
      console.log(`Kakao API 요청: ${query}`);
      const response = await fetch(
        `https://dapi.kakao.com/v2/local/search/keyword.json?query=${query}`,
        {
          method: "GET",
          headers: {
            Authorization: `KakaoAK ${config.KAKAO_REST_API_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Response Status:", response.status);
      const data = await response.json();

      if (data.documents && data.documents.length > 0) {
        const firstResult = data.documents[0];
        //검색 결과 목록 전체를 searchResults state에 저장
        setSearchResults(data.documents);
        setSelectedPlace(null); //선택된 장소는 일단 초기화
      } else {
        console.log("No results found");
        setSearchResults([]); // 검색 결과가 없으면 빈 배열로 초기화
        setSelectedPlace(null);
      }
    } catch (error) {
      console.error("Kakao API 요청 오류:", error);
    }
  };

  // WebView에서 Kakao 지도 불러오기 확인용
  const handleMessage = (event) => {
    console.log("WebView 메시지 수신:", event.nativeEvent.data);
  };

  // 장소 등록
  const handleRegistration = async () => {
    if (!selectedPlace) {
      alert("장소를 선택해주세요!");
      return;
    }
    try {
      const response = await axios.post(
        `${config.API_BASE_URL}/api/users/${user?.id}/muckits`,
        {
          userId: user?.id,
          name: selectedPlace.name,
          address: selectedPlace.address,
          lat: selectedPlace.lat,
          lng: selectedPlace.lng,
        }
      );
      console.log("등록 완료:", response.data);
      navigation.navigate("ListScreen", { refresh: true });
    } catch (error) {
      console.error("등록 오류:", error.response?.data || error.message);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />

      {/* === 플로팅 상단 영역 (검색바 + 칩 + 현 지도 재검색) === */}
      <View pointerEvents="box-none" style={styles.floatingTop}>
        <View style={[styles.searchBar, isTablet && { borderRadius: 28, paddingVertical: 12 }]}>
          <Text style={styles.searchIcon}>🔎</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="지역, 가게 이름 검색"
            placeholderTextColor="#B6B6B6"
            value={searchQuery}
            returnKeyType="search"
            onChangeText={setSearchQuery}
            onSubmitEditing={() => fetchKakaoAddress(searchQuery)}
          />
          <Pressable onPress={() => fetchKakaoAddress(searchQuery)} style={styles.searchBtn}>
            <Text style={styles.searchBtnText}>검색</Text>
          </Pressable>
        </View>

        {/* 검색 결과 카드 리스트 (오버레이) */}
        {searchResults.length > 0 && (
          <FlatList
            data={searchResults}
            keyExtractor={(item) => item.id}
            keyboardShouldPersistTaps="handled"
            style={styles.resultsList}
            renderItem={({ item }) => (
              <TouchableOpacity
                activeOpacity={0.9}
                style={styles.resultCard}
                onPress={() => {
                  setSelectedPlace({
                    name: item.place_name,
                    address: item.road_address_name || item.address_name,
                    lat: item.y,
                    lng: item.x,
                  });
                  setSearchResults([]);
                }}
              >
                <Text style={styles.resultTitle}>{item.place_name}</Text>
                <Text style={styles.resultAddr}>
                  {item.road_address_name || item.address_name}
                </Text>
              </TouchableOpacity>
            )}
          />
        )}

        {/* 필터 칩들 (동작 연결은 추후)
        <View style={styles.chipsRow}>
          {["내 주변", "필터", "카페", "음식점"].map((label) => (
            <Pressable key={label} style={styles.chip}>
              <Text style={styles.chipText}>{label}</Text>
            </Pressable>
          ))}
        </View> */}

        {/* 현 지도에서 재검색 */}
        <Pressable style={styles.searchThisArea} onPress={() => fetchKakaoAddress(searchQuery)}>
          {/* <Text style={styles.searchThisAreaText}>↻ 현 지도에서 재검색</Text> */}
        </Pressable>
      </View>

      {/* === 지도 (엣지-투-엣지) === */}
      <View style={StyleSheet.absoluteFill}>
        <WebView
          ref={webViewRef}
          originWhitelist={["*"]}
          source={{
            html: `
              <!DOCTYPE html>
              <html lang="ko">
              <head>
                <meta charset="utf-8">
                <meta name="viewport" content="initial-scale=1, maximum-scale=1"/>
                <title>카카오 지도</title>
                <style>
                  html,body,#map{height:100%;margin:0;padding:0;}
                </style>
                <script src="https://dapi.kakao.com/v2/maps/sdk.js?appkey=${
                  config.KAKAO_JAVASCRIPT_KEY
                }&libraries=services"></script>
              </head>
              <body>
                <div id="map"></div>
                <script>
                  var mapContainer = document.getElementById('map');
                  var mapOption = {
                    center: new kakao.maps.LatLng(${
                      (selectedPlace && selectedPlace.lat) || 37.5665
                    }, ${
              (selectedPlace && selectedPlace.lng) || 126.9780
            }),
                    level: 3
                  };
                  var map = new kakao.maps.Map(mapContainer, mapOption);

                  ${
                    selectedPlace
                      ? `
                  var marker = new kakao.maps.Marker({
                    position: new kakao.maps.LatLng(${selectedPlace.lat}, ${selectedPlace.lng}),
                    map: map
                  });
                  var infowindow = new kakao.maps.InfoWindow({
                    content: '<div style="padding:6px 8px;font-size:12px;border-radius:8px;">${selectedPlace.name}</div>'
                  });
                  infowindow.open(map, marker);
                  `
                      : ""
                  }
                </script>
              </body>
              </html>
            `,
          }}
          javaScriptEnabled
          domStorageEnabled
          onMessage={handleMessage}
          onLoadEnd={() => console.log("WebView 로드 완료")}
        />
      </View>

      {/* (선택) 현재 위치 FAB */}
      <Pressable style={styles.locFab} onPress={() => { /* 현재 위치로 이동 로직 */ }}>
        <Text style={{ fontSize: 18 }}>📍</Text>
      </Pressable>

      {/* === 하단 바텀시트 === */}
      <View style={[styles.bottomSheet, isTablet && { borderTopLeftRadius: 24, borderTopRightRadius: 24, paddingHorizontal: 24 }]}>
        <View style={styles.sheetHandle} />
        {selectedPlace ? (
          <>
            <View style={styles.placeRow}>
              <View style={styles.placeDot} />
              <View style={{ flex: 1 }}>
                <Text style={styles.placeName}>{selectedPlace.name}</Text>
                <Text style={styles.placeAddr}>{selectedPlace.address}</Text>
              </View>
            </View>

            <Pressable
              onPress={handleRegistration}
              style={({ pressed }) => [
                styles.cta,
                pressed && { transform: [{ scale: 0.98 }] },
              ]}
            >
              <Text style={styles.ctaText}>+ 등록하기</Text>
            </Pressable>
          </>
        ) : (
          <Text style={styles.emptyText}>검색 후 장소를 선택하면 여기에 나타나요.</Text>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },

  /* 상단 플로팅 */
  floatingTop: {
    position: "absolute",
    top: Platform.OS === "android" ? 70 : 100,
    left: 16,
    right: 16,
    zIndex: 30,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.surface,
    borderRadius: 24,
    paddingHorizontal: 14,
    paddingVertical: 10,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  searchIcon: { fontSize: 16, marginRight: 8 },
  searchInput: { flex: 1, fontSize: 15, color: COLORS.text, paddingVertical: 0 },
  searchBtn: { backgroundColor: COLORS.primary, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 18 },
  searchBtnText: { color: "#FFF", fontWeight: "700" },

  resultsList: {
    position: "absolute",
    top: 56,
    left: 0,
    right: 0,
    maxHeight: 260,
    backgroundColor: COLORS.overlay,
    borderRadius: 16,
    padding: 6,
    borderWidth: 1,
    borderColor: COLORS.line,
  },
  resultCard: {
    backgroundColor: COLORS.surface,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 12,
    marginVertical: 6,
    borderWidth: 1,
    borderColor: "#F3F3F3",
  },
  resultTitle: { fontSize: 16, fontWeight: "700", color: COLORS.text },
  resultAddr: { marginTop: 2, fontSize: 12, color: COLORS.sub },

  chipsRow: { flexDirection: "row", gap: 8, marginTop: 10 },
  chip: {
    backgroundColor: "#F6F6F6",
    borderRadius: 18,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "#ECECEC",
  },
  chipText: { color: COLORS.text, fontSize: 13 },

  searchThisArea: {
    alignSelf: "center",
    marginTop: 10,
    backgroundColor: COLORS.surface,
    borderRadius: 22,
    paddingHorizontal: 14,
    paddingVertical: 8,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.07,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  searchThisAreaText: { color: "#2C6BED", fontWeight: "700" },

  /* 바텀시트 */
  bottomSheet: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 24,
    backgroundColor: COLORS.overlay,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderTopWidth: 1,
    borderColor: COLORS.line,
    elevation: 8,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: -2 },
  },
  sheetHandle: {
    alignSelf: "center",
    width: 44,
    height: 5,
    borderRadius: 3,
    backgroundColor: "#DADADA",
    marginBottom: 8,
  },
  placeRow: { flexDirection: "row", gap: 12, alignItems: "center" },
  placeDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: COLORS.primary, marginTop: 2 },
  placeName: { fontSize: 16, fontWeight: "700", color: COLORS.text },
  placeAddr: { fontSize: 12, color: COLORS.sub, marginTop: 2 },

  cta: {
    marginTop: 12,
    backgroundColor: COLORS.primary,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  ctaText: { color: "#FFF", fontWeight: "800", fontSize: 16 },
  emptyText: { textAlign: "center", color: COLORS.sub, paddingVertical: 8 },

  /* 현재 위치 FAB (선택) */
  locFab: {
    position: "absolute",
    right: 16,
    bottom: 110,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.surface,
    alignItems: "center",
    justifyContent: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
});


// const styles = StyleSheet.create({
//   container: { flex: 1 },
//   searchContainer: {
//     flexDirection: "row",
//     padding: 10,
//     alignItems: "center",
//     justifyContent: "space-between",
//   },
//   input: {
//     flex: 1,
//     borderWidth: 1,
//     padding: 10,
//     marginRight: 10,
//   },

//   // --- 검색 결과 목록 스타일 ---
//   resultsList: {
//       position: 'absolute',
//       top: 60, // 검색창 바로 아래
//       left: 10,
//       right: 10,
//       maxHeight: 250, // 목록의 최대 높이
//       backgroundColor: 'white',
//       borderRadius: 5,
//       zIndex: 10, // 지도를 덮도록 설정
//       borderWidth: 1,
//       borderColor: '#eee',
//   },
//   resultItem: {
//       padding: 15,
//       borderBottomWidth: 1,
//       borderBottomColor: '#eee',
//   },
//   resultName: {
//       fontSize: 16,
//       fontWeight: 'bold',
//   },
//   resultAddress: {
//       fontSize: 12,
//       color: 'gray',
//   },
//   // --- 하단 정보창 스타일 ---
//   infoContainer: { padding: 15, backgroundColor: "white", alignItems: "center", borderTopWidth: 1, borderColor: '#eee' },
//   infoName: { fontSize: 18, fontWeight: 'bold' },
//   infoAddress: { color: 'gray', marginBottom: 10 },
// });

export default MapScreen;
