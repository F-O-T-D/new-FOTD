/*
사용자가 검색할 수 있는 지도 화면

사용자가 검색어 입력 후 장소를 검색하고 선택 가능.
카카오맵 WebView 내부에서 검색 기능 (searchPlaces()) 실행.
*/

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

    // ✅ Kakao API 요청 함수 (REST API Key 사용)
    const fetchKakaoAddress = async (query) => { 
      try {
        console.log(`🔍 Kakao API 요청: ${query}`);
  
        const response = await fetch(`https://dapi.kakao.com/v2/local/search/keyword.json?query=${query}`, {
          method: 'GET',
          headers: {
            'Authorization': `KakaoAK ${config.KAKAO_REST_API_KEY}`, // ✅ REST API Key 사용
            'Content-Type': 'application/json',
          }
        });
  
        console.log('✅ Response Status:', response.status);
        const data = await response.json();
        console.log('📍 Kakao API 응답 데이터:', data);
  
        if (data.documents && data.documents.length > 0) {
          const firstResult = data.documents[0];
          setSelectedPlace({
            name: firstResult.place_name,
            address: firstResult.road_address_name || firstResult.address_name,
            lat: firstResult.y,
            lng: firstResult.x,
          });
  
          console.log('📍 검색 결과:', firstResult);
        } else {
          console.log('❌ No results found');
        }
      } catch (error) {
        console.error('❌ Kakao API 요청 오류:', error);
      }
    };


  // 사용자가 입력한 검색어를 기반으로 WebView 내에서 장소를 검색
  const handleSearch = () => {
    console.log("🔍 검색 버튼 눌림! 현재 입력값:", searchQuery);
  
    if (searchQuery.trim() !== '') {
      fetchKakaoAddress(searchQuery);
    } else {
      console.log("❌ 검색어를 입력하세요.");
    }
  };


  // 선택한 장소를 서버에 등록하고, 등록 후 목록 화면으로 이동
  const handleRegistration = async () => {
    if (!selectedPlace) {
      alert("장소를 선택해주세요!");
      return;
    }

    try {
      const response = await axios.post(`${config.API_BASE_URL}/api/map/${user.user_id}`, {
        userId: user.user_id,
        name: selectedPlace.name,
        address: selectedPlace.address,
        lat: selectedPlace.lat,
        lng: selectedPlace.lng,
      });

      console.log("등록 완료:", response.data);
      navigation.navigate("ListScreen", { refresh: true });
    } catch (error) {
      console.error("등록 오류:", error);
    }
  };

  // WebView에서 선택한 장소 정보를 받아와 상태로 저장
  const handleMessage = (event) => {
    const data = JSON.parse(event.nativeEvent.data);
    setSelectedPlace(data);
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
        <Button title="검색" onPress={() => {
          console.log("🔍 검색 버튼 클릭됨");
          handleSearch();
          }} />
      </View>

      {/* 카카오 지도 WebView */}
      <WebView
        ref={webViewRef}
        source={{ html: getMapHtml() }}
        javaScriptEnabled={true}  // ✅ JavaScript 실행 허용
        domStorageEnabled={true}   // ✅ 웹 페이지의 localStorage 사용 허용
        onMessage={handleMessage}
      />

      {/* 선택한 장소 정보 */}
      {selectedPlace && (
        <View style={styles.infoContainer}>
          <Text>{selectedPlace.name}</Text>
          <Text>{selectedPlace.address}</Text>
          <MiniButton title="등록하기" onPress={handleRegistration} />
        </View>
      )}
    </View>
  );
};

console.log("✅ KAKAO_MAP_API_KEY:", config.KAKAO_MAP_API_KEY);


// 카카오 지도 API를 사용하여 장소 검색 및 선택 기능을 제공하는 HTML 코드
const getMapHtml = () => `
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="utf-8">
  <title>카카오 지도</title>
  <script type="text/javascript" src="//dapi.kakao.com/v2/maps/sdk.js?appkey=${config.KAKAO_JAVASCRIPT_KEY}&libraries=services"></script>
</head>
<body>
  <div id="map" style="width:100%;height:400px;"></div>
  <script>
    console.log("✅ 카카오 지도 API 로드됨");

    function initMap() {
      var mapContainer = document.getElementById('map'); 
      var mapOption = { center: new kakao.maps.LatLng(37.566826, 126.9786567), level: 3 };
      var map = new kakao.maps.Map(mapContainer, mapOption);
      console.log("✅ 지도 생성 완료:", map);

      var ps = new kakao.maps.services.Places();
      var infowindow = new kakao.maps.InfoWindow({ zIndex: 1 });

      function searchPlaces(query) {
        console.log("🔍 WebView에서 searchPlaces 실행됨:", query);
        ps.keywordSearch(query, function (data, status) {
          console.log("📍 검색 결과:", status, "데이터:", data);

          if (status === kakao.maps.services.Status.OK) {
            var bounds = new kakao.maps.LatLngBounds();
            var results = [];

            for (var i = 0; i < data.length; i++) {
              displayMarker(data[i]);
              bounds.extend(new kakao.maps.LatLng(data[i].y, data[i].x));
              results.push({
                name: data[i].place_name,
                address: data[i].road_address_name || data[i].address_name,
                lat: data[i].y,
                lng: data[i].x
              });
            }

            map.setBounds(bounds);
            // React Native로 검색 결과 전송
            window.ReactNativeWebView.postMessage(JSON.stringify(results));
          } else {
            console.log("❌ 검색 결과 없음");
            window.ReactNativeWebView.postMessage(JSON.stringify([]));
          }
        });
      }

      function displayMarker(place) {
        var marker = new kakao.maps.Marker({
          map: map,
          position: new kakao.maps.LatLng(place.y, place.x),
        });

        kakao.maps.event.addListener(marker, 'click', function () {
          infowindow.setContent('<div style="padding:5px;font-size:12px;">' + place.place_name + '</div>');
          infowindow.open(map, marker);

          // React Native로 장소 정보 전달
          window.ReactNativeWebView.postMessage(JSON.stringify({
            name: place.place_name,
            address: place.road_address_name || place.address_name,
            lat: place.y,
            lng: place.x
          }));
        });
      }
    }

    kakao.maps.load(initMap); // ✅ Kakao API가 로드된 후 initMap 실행
  </script>
</body>
</html>
`;


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
  },
});

export default MapScreen;
