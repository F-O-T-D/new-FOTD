import React, { useState, useRef } from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import { WebView } from "react-native-webview";
import { useNavigation } from "@react-navigation/native";
import MiniButton from "../Components/MiniButton";
import axios from "axios";
import config from "../config";
import { useUserState } from "../Contexts/UserContext";

const MapScreen = () => {
  const navigation = useNavigation();
  const webViewRef = useRef(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [user] = useUserState();

  // Kakao API 요청 함수 (REST API Key 사용)
  const fetchKakaoAddress = async (query) => {
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
      console.log("Kakao API 응답 데이터:", data);

      if (data.documents && data.documents.length > 0) {
        const firstResult = data.documents[0];
        setSelectedPlace({
          name: firstResult.place_name,
          address: firstResult.road_address_name || firstResult.address_name,
          lat: firstResult.y,
          lng: firstResult.x,
        });

        console.log("검색 결과:", firstResult);
      } else {
        console.log("No results found");
        setSelectedPlace(null); // 검색 결과가 없을 때 초기화
      }
    } catch (error) {
      console.error("Kakao API 요청 오류:", error);
    }
  };

  // WebView에서 Kakao 지도 불러오기 확인용
  const handleMessage = (event) => {
    console.log("WebView 메시지 수신:", event.nativeEvent.data);
  };

  // 장소 등록 기능
  const handleRegistration = async () => {
    if (!selectedPlace) {
      alert("장소를 선택해주세요!");
      return;
    }
    try {
      const response = await axios.post(
        `${config.API_BASE_URL}/api/map/${user?.id}`,
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
    <View style={styles.container}>
      {/* 검색창 */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.input}
          placeholder="장소 검색"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <Button
          title="검색"
          onPress={() => {
            console.log("검색 버튼 클릭됨");
            fetchKakaoAddress(searchQuery);
          }}
        />
      </View>

      {/* WebView로 Kakao 지도 표시 */}
      <WebView
        ref={webViewRef}
        originWhitelist={["*"]}
        source={{
          html: `
          <!DOCTYPE html>
          <html lang="ko">
          <head>
            <meta charset="utf-8">
            <title>카카오 지도</title>
            <script type="text/javascript" src="https://dapi.kakao.com/v2/maps/sdk.js?appkey=${config.KAKAO_JAVASCRIPT_KEY}&libraries=services"></script>
          </head>
          <body>
            <div id="map" style="width:100%; height:100vh;"></div> <!-- 높이를 70vh로 설정 -->
            <script>
              var mapContainer = document.getElementById('map');
              var mapOption = { 
                  center: new kakao.maps.LatLng(${selectedPlace?.lat || 37.5665}, ${selectedPlace?.lng || 126.9780}),
                  level: 3
              };
              var map = new kakao.maps.Map(mapContainer, mapOption);
        
              if (${selectedPlace ? true : false}) {
                var marker = new kakao.maps.Marker({
                    position: new kakao.maps.LatLng(${selectedPlace?.lat || 37.5665}, ${selectedPlace?.lng || 126.9780}),
                    map: map
                });
        
                var infowindow = new kakao.maps.InfoWindow({
                    content: '<div style="padding:5px;font-size:12px;">${selectedPlace?.name || "기본 위치"}</div>'
                });
                kakao.maps.event.addListener(marker, 'click', function() {
                    infowindow.open(map, marker);
                });
              }
            </script>
          </body>
          </html>
          `,
        }}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        onMessage={handleMessage}
        style={{flex: 1}}
        onLoadEnd={() => console.log("WebView 로드 완료")}
      />

      {/* 선택한 장소 정보 및 등록 버튼 */}
      {selectedPlace ? (
        <View style={styles.infoContainer}>
          <Text>{selectedPlace.name}</Text>
          <Text>{selectedPlace.address}</Text>
          <MiniButton title="등록하기" onPress={handleRegistration} />
        </View>
      ) : (
        <View style={styles.infoContainer}>
          <Text>검색 결과가 없습니다. 다른 키워드로 검색해주세요.</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  searchContainer: {
    flexDirection: "row",
    padding: 10,
    alignItems: "center",
    justifyContent: "space-between",
  },
  input: {
    flex: 1,
    borderWidth: 1,
    padding: 10,
    marginRight: 10,
  },
  infoContainer: {
    padding: 10,
    backgroundColor: "#f8f8f8",
    alignItems: "center",
  },
});

export default MapScreen;
