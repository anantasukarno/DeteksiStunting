import { Text, View, TextInput, StyleSheet, TouchableOpacity, Pressable, Dimensions, FlatList, Image, Picker, Alert } from 'react-native'
import React, { Component } from 'react'
import Modal from "react-native-modal";
import { getDatabase, ref, child, get, remove, query, orderByChild, equalTo, onValue, update } from "firebase/database";
import SkeletonContent from 'react-native-skeleton-content';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faSearch, faUser, faX } from '@fortawesome/free-solid-svg-icons'
import AsyncStorage from '@react-native-async-storage/async-storage';

export class TambahPertumbuhan extends Component {
    constructor(props){
        super(props);
        this.state = {
            usia: 0,
            beratBadan: 0,
            tinggiBadan: 0,
            nik: '',
            idAnggota: '',
            nama: '',
            jenisKelamin: '',
            modalVisible: false,
            data: [],
            dataFilltered: [],
            isLoad: true,
            isUser: false,
            namaUser: '',
            wilayah: '',
            idUser: '',
            isLoad: true
        }
    }

    async componentDidMount(){
        await this.getPetugas()
        this.getData()

        setTimeout(() => this.setState({ isLoad: false}), 1000)

        const {navigation,route}=this.props;
        if(route.params) {
            const { idAnggota, nama, jenisKelamin } = route.params;
            if (idAnggota != null) {
                this.setState({
                    isUser: true,
                    idAnggota: idAnggota,
                    namaUser: nama,
                    jenisKelamin: jenisKelamin,
                })
            }
        }
        
    }

    //Mendapatkan identitas
    async getPetugas(){
        const userId = await AsyncStorage.getItem('idUser')
        const dbRef = ref(getDatabase());
        get(child(dbRef, `dataPetugas/${userId}`)).then((snapshot) => {
        if (snapshot.exists()) {
            this.setState({
                wilayah: snapshot.val().wilayah,
            })
            console.log(this.state.wilayah)
        } else {
            console.log("No data available");
        }
        }).catch((error) => {
        console.error(error);
        });
    }

    //Mengambil data anggota
    async getData() {
        const dbRef = ref(getDatabase());
        const db = getDatabase()
        const refAnggota = await query(ref(db, "dataAnggota"), orderByChild("level"), equalTo("anggota"))
        onValue(refAnggota, (snapshot) => {
            this.setState({
                ...this.state,
                data: snapshot.val(),
                dataFilltered: snapshot.val()
            })
            const asArray = Object.entries(this.state.data);
            const filtered = asArray.filter((item) => {
                return item[1].puskesmas.toLowerCase().includes(this.state.wilayah.toLowerCase())
            });
            const justStrings = Object.fromEntries(filtered);
            this.setState({
                data: justStrings,
                dataFilltered: justStrings,
                isLoad: true,
            })
          }, {
            onlyOnce: true
        });
    }

    //Filter Pencarian
    filterData(text){     
        const asArray = Object.entries(this.state.data);
        const filtered = asArray.filter((item) => {
            return item[1].nama.toLowerCase().includes(text.toLowerCase())
        });
        const justStrings = Object.fromEntries(filtered);
        this.setState({
            dataFilltered: justStrings
        })
    }

    search = (searchText) => {
        this.setState({searchText: searchText});
        this.filterData(searchText)
    }

    //saat anak dipilih
    onAnakSelected(id, nama, nik, jenisKelamin){
        this.setState({
            ...this.state,
            idAnggota:  id,
            nama: nama,
            nik: nik,
            jenisKelamin: jenisKelamin,
            modalVisible: !this.state.modalVisible,
            tanggal: ''
        })
    }

    hitungStunting(tinggi, berat, jenisKelamin, usia){
        let hasil;
        let hasilText;
        let perhitungan;

        if (jenisKelamin != 0 && usia != 0 && tinggi && berat) {
            if(this.state.jenisKelamin == 'Laki-laki'){
                switch(this.state.usia){
                    case "24":
                        if(this.state.tinggiBadan < 87.1){
                            hasil = (this.state.tinggiBadan - 87.1) / (87.1 - 84.1)
                        }
                        else{
                            hasil = (this.state.tinggiBadan - 87.1) / (90.2 - 87.1)
                        }
                        break;
                    case "25":
                        if(this.state.tinggiBadan < 88.0){
                            hasil = (this.state.tinggiBadan - 88.0) / (88.0 - 84.9)
                        }
                        else{
                            hasil = (this.state.tinggiBadan - 88.0) / (91.1 - 88.0)
                        }
                        break;
                    case "26":
                        if(this.state.tinggiBadan < 88.8){
                            hasil = (this.state.tinggiBadan - 88.8) / (88.8 - 85.6)
                        }
                        else{
                            hasil = (this.state.tinggiBadan - 88.8) / (92 - 88.8)
                        }
                        break;
                    case "27":
                        if(this.state.tinggiBadan < 89.6){
                            hasil = (this.state.tinggiBadan - 89.6) / (89.6 - 86.4)
                        }
                        else{
                            hasil = (this.state.tinggiBadan - 89.6) / (92.9 - 89.6)
                        }
                        break;
                    case "28":
                        if(this.state.tinggiBadan < 90.4){
                            hasil = (this.state.tinggiBadan - 90.4) / (90.4 - 87.1)
                        }
                        else{
                            hasil = (this.state.tinggiBadan - 90.4) / (93.7 - 90.4)
                        }
                        break;
                    case "29":
                        if(this.state.tinggiBadan < 91.2){
                            hasil = (this.state.tinggiBadan - 91.2) / (91.2 - 87.8)
                        }
                        else{
                            hasil = (this.state.tinggiBadan - 91.2) / (94.5 - 91.2)
                        }
                        break;
                    case "30":
                        if(this.state.tinggiBadan < 91.9){
                            hasil = (this.state.tinggiBadan - 91.9) / (91.9 - 88.5)
                        }
                        else{
                            hasil = (this.state.tinggiBadan - 91.9) / (95.3 - 91.9)
                        }
                        break;
                    case "31":
                        if(this.state.tinggiBadan < 92.7){
                            hasil = (this.state.tinggiBadan - 92.7) / (92.7 - 89.2)
                        }
                        else{
                            hasil = (this.state.tinggiBadan - 92.7) / (96.1 - 92.7)
                        }
                        break;
                    case "32":
                        if(this.state.tinggiBadan < 93.4){
                            hasil = (this.state.tinggiBadan - 93.4) / (93.4 - 89.9)
                        }
                        else{
                            hasil = (this.state.tinggiBadan - 93.4) / (96.9 - 93.4)
                        }
                        break;
                    case "33":
                        if(this.state.tinggiBadan < 94.1){
                            hasil = (this.state.tinggiBadan - 94.1) / (94.1 - 90.5)
                        }
                        else{
                            hasil = (this.state.tinggiBadan - 94.1) / (97.6 - 94.1)
                        }
                        break;
                    case "34":
                        if(this.state.tinggiBadan < 94.8){
                            hasil = (this.state.tinggiBadan - 94.8) / (94.8 - 91.1)
                        }
                        else{
                            hasil = (this.state.tinggiBadan - 94.8) / (98.4- 94.8)
                        }
                        break;
                    case "35":
                        if(this.state.tinggiBadan < 95.4){
                            hasil = (this.state.tinggiBadan - 95.4) / (95.4 - 91.8)
                        }
                        else{
                            hasil = (this.state.tinggiBadan - 95.4) / (99.1- 95.4)
                        }
                        break;
                    case "36":
                        if(this.state.tinggiBadan < 96.1){
                            hasil = (this.state.tinggiBadan - 96.1) / (96.1 - 92.4)
                        }
                        else{
                            hasil = (this.state.tinggiBadan - 96.1) / (99.8- 96.1)
                        }
                        break;
                    case "37":
                        if(this.state.tinggiBadan < 96.7){
                            hasil = (this.state.tinggiBadan - 96.7) / (96.7 - 93)
                        }
                        else{
                            hasil = (this.state.tinggiBadan - 96.7) / (100.5 - 96.7)
                        }
                        break;
                    case "38":
                        if(this.state.tinggiBadan < 97.4){
                            hasil = (this.state.tinggiBadan - 97.4) / (97.4 - 93.6)
                        }
                        else{
                            hasil = (this.state.tinggiBadan - 97.4) / (101.2 - 97.4)
                        }
                        break;
                    case "39":
                        if(this.state.tinggiBadan < 98){
                            hasil = (this.state.tinggiBadan - 98) / (98 - 94.2)
                        }
                        else{
                            hasil = (this.state.tinggiBadan - 98) / (101.8 - 98)
                        }
                        break;
                    case "40":
                        if(this.state.tinggiBadan < 98.6){
                            hasil = (this.state.tinggiBadan - 98.6) / (98.6 - 94.7)
                        }
                        else{
                            hasil = (this.state.tinggiBadan - 98.6) / (102.5- 98.6)
                        }
                        break;
                    case "41":
                        if(this.state.tinggiBadan < 99.2){
                            hasil = (this.state.tinggiBadan - 99.2) / (99.2 - 95.3)
                        }
                        else{
                            hasil = (this.state.tinggiBadan - 99.2) / (103.2- 99.2)
                        }
                        break;
                    case "42":
                        if(this.state.tinggiBadan < 99.9){
                            hasil = (this.state.tinggiBadan - 99.9) / (99.9 - 95.9)
                        }
                        else{
                            hasil = (this.state.tinggiBadan - 99.9) / (103.8- 99.9)
                        }
                        break;
                    case "43":
                        if(this.state.tinggiBadan < 100.4){
                            hasil = (this.state.tinggiBadan - 100.4) / (100.4 - 96.4)
                        }
                        else{
                            hasil = (this.state.tinggiBadan - 100.4) / (104.5- 100.4)
                        }
                        break;
                    case "44":
                        if(this.state.tinggiBadan < 101){
                            hasil = (this.state.tinggiBadan - 101) / (101 - 97)
                        }
                        else{
                            hasil = (this.state.tinggiBadan - 101) / (105.1 - 101)
                        }
                        break;
                    case "45":
                        if(this.state.tinggiBadan < 101.6){
                            hasil = (this.state.tinggiBadan - 101.6) / (101.6 - 97.5)
                        }
                        else{
                            hasil = (this.state.tinggiBadan - 101.6) / (105.7 - 101.6)
                        }
                        break;
                    case "46":
                        if(this.state.tinggiBadan < 102.2){
                            hasil = (this.state.tinggiBadan - 102.2) / (102.2 - 98.1)
                        }
                        else{
                            hasil = (this.state.tinggiBadan - 102.2) / (106.3 - 102.2)
                        }
                        break;
                    case "47":
                        if(this.state.tinggiBadan < 102.8){
                            hasil = (this.state.tinggiBadan - 102.8) / (102.8 - 98.6)
                        }
                        else{
                            hasil = (this.state.tinggiBadan - 102.8) / (106.9 - 102.8)
                        }
                        break;
                    case "48":
                        if(this.state.tinggiBadan < 103.3){
                            hasil = (this.state.tinggiBadan - 103.3) / (103.3 - 99.1)
                        }
                        else{
                            hasil = (this.state.tinggiBadan - 103.3) / (107.5 - 103.3)
                        }
                        break;
                    case "49":
                        if(this.state.tinggiBadan < 103.9){
                            hasil = (this.state.tinggiBadan - 103.9) / (103.9 - 99.7)
                        }
                        else{
                            hasil = (this.state.tinggiBadan - 103.9) / (108.1 - 103.9)
                        }
                        break;
                    case "50":
                        if(this.state.tinggiBadan < 104.4){
                            hasil = (this.state.tinggiBadan - 104.4) / (104.4 - 100.2)
                        }
                        else{
                            hasil = (this.state.tinggiBadan - 104.4) / (108.7 - 104.4)
                        }
                        break;
                    case "51":
                        if(this.state.tinggiBadan < 105){
                            hasil = (this.state.tinggiBadan - 105) / (105 - 100.7)
                        }
                        else{
                            hasil = (this.state.tinggiBadan - 105) / (109.3 - 105)
                        }
                        break;
                    case "52":
                        if(this.state.tinggiBadan < 105.6){
                            hasil = (this.state.tinggiBadan - 105.6) / (105.6 - 101.2)
                        }
                        else{
                            hasil = (this.state.tinggiBadan - 105.6) / (109.9 - 105.6)
                        }
                        break;
                    case "53":
                        if(this.state.tinggiBadan < 106.1){
                            hasil = (this.state.tinggiBadan - 106.1) / (106.1 - 101.7)
                        }
                        else{
                            hasil = (this.state.tinggiBadan - 106.1) / (110.5- 106.1)
                        }
                        break;
                    case "54":
                        if(this.state.tinggiBadan < 106.7){
                            hasil = (this.state.tinggiBadan - 106.7) / (106.7 - 102.3)
                        }
                        else{
                            hasil = (this.state.tinggiBadan - 106.7) / (111.1- 106.7)
                        }
                        break;
                    case "55":
                        if(this.state.tinggiBadan < 107.2){
                            hasil = (this.state.tinggiBadan - 107.2) / (107.2 - 102.8)
                        }
                        else{
                            hasil = (this.state.tinggiBadan - 107.2) / (111.7- 107.2)
                        }
                        break;
                    case "56":
                        if(this.state.tinggiBadan < 107.8){
                            hasil = (this.state.tinggiBadan - 107.8) / (107.8 - 103.3)
                        }
                        else{
                            hasil = (this.state.tinggiBadan - 107.8) / (112.3- 107.8)
                        }
                        break;
                    case "57":
                        if(this.state.tinggiBadan < 108.3){
                            hasil = (this.state.tinggiBadan - 108.3) / (108.3 - 103.8)
                        }
                        else{
                            hasil = (this.state.tinggiBadan - 108.3) / (112.8- 108.3)
                        }
                        break;
                    case "58":
                        if(this.state.tinggiBadan < 108.9){
                            hasil = (this.state.tinggiBadan - 108.9) / (108.9 - 104.3)
                        }
                        else{
                            hasil = (this.state.tinggiBadan - 108.9) / (113.4- 108.9)
                        }
                        break;
                    case "59":
                        if(this.state.tinggiBadan < 109.4){
                            hasil = (this.state.tinggiBadan - 109.4) / (109.4 - 104.8)
                        }
                        else{
                            hasil = (this.state.tinggiBadan - 109.4) / (114 - 109.4)
                        }
                        break;
                    case "60":
                        if(this.state.tinggiBadan < 110){
                            hasil = (this.state.tinggiBadan - 110) / (110 - 105.3)
                        }
                        else{
                            hasil = (this.state.tinggiBadan - 110) / (114.6 - 110)
                        }
                        break;
                }
            }
            else{
                switch(this.state.usia){
                    case "24":
                        if(this.state.tinggiBadan < 85.7){
                            hasil = (this.state.tinggiBadan - 85.7) / (85.7 - 82.5)
                        }
                        else{
                            hasil = (this.state.tinggiBadan - 85.7) / (88.9 - 85.7)
                        }
                        break;
                    case "25":
                        if(this.state.tinggiBadan < 86.6){
                            hasil = (this.state.tinggiBadan - 86.6) / (86.6 - 83.3)
                        }
                        else{
                            hasil = (this.state.tinggiBadan - 86.6) / (89.9 - 86.6)
                        }
                        break;
                    case "26":
                        if(this.state.tinggiBadan < 87.4){
                            hasil = (this.state.tinggiBadan - 87.4) / (87.4 - 84.1)
                        }
                        else{
                            hasil = (this.state.tinggiBadan - 87.4) / (90.8 - 87.4)
                        }
                        break;
                    case "27":
                        if(this.state.tinggiBadan < 88.3){
                            hasil = (this.state.tinggiBadan - 88.3) / (88.3 - 84.9)
                        }
                        else{
                            hasil = (this.state.tinggiBadan - 88.3) / (91.7- 88.3)
                        }
                        break;
                    case "28":
                        if(this.state.tinggiBadan < 89.1){
                            hasil = (this.state.tinggiBadan - 89.1) / (89.1 - 85.7)
                        }
                        else{
                            hasil = (this.state.tinggiBadan - 89.1) / (92.5- 89.1)
                        }
                        break;
                    case "29":
                        if(this.state.tinggiBadan < 89.9){
                            hasil = (this.state.tinggiBadan - 89.9) / (89.9 - 86.4)
                        }
                        else{
                            hasil = (this.state.tinggiBadan - 89.9) / (93.4- 89.9)
                        }
                        break;
                    case "30":
                        if(this.state.tinggiBadan < 90.7){
                            hasil = (this.state.tinggiBadan - 90.7) / (90.7 - 87.1)
                        }
                        else{
                            hasil = (this.state.tinggiBadan - 90.7) / (94.2- 90.7)
                        }
                        break;
                    case "31":
                        if(this.state.tinggiBadan < 91.4){
                            hasil = (this.state.tinggiBadan - 91.4) / (91.4 - 87.9)
                        }
                        else{
                            hasil = (this.state.tinggiBadan - 91.4) / (95.0- 91.4)
                        }
                        break;
                    case "32":
                        if(this.state.tinggiBadan < 92.2){
                            hasil = (this.state.tinggiBadan - 92.2) / (92.2 - 88.6)
                        }
                        else{
                            hasil = (this.state.tinggiBadan - 92.2) / (95.8 - 92.2)
                        }
                        break;
                    case "33":
                        if(this.state.tinggiBadan < 92.9){
                            hasil = (this.state.tinggiBadan - 92.9) / (92.9 - 89.3)
                        }
                        else{
                            hasil = (this.state.tinggiBadan - 92.9) / (96.6 - 92.9)
                        }
                        break;
                    case "34":
                        if(this.state.tinggiBadan < 93.6){
                            hasil = (this.state.tinggiBadan - 93.6) / (93.6 -89.9)
                        }
                        else{
                            hasil = (this.state.tinggiBadan - 93.6) / (97.4 - 93.6)
                        }
                        break;
                    case "35":
                        if(this.state.tinggiBadan < 94.4){
                            hasil = (this.state.tinggiBadan - 94.4) / (94.4 - 90.6)
                        }
                        else{
                            hasil = (this.state.tinggiBadan - 94.4) / (98.1 - 94.4)
                        }
                        break;
                    case "36":
                        if(this.state.tinggiBadan < 95.1){
                            hasil = (this.state.tinggiBadan - 95.1) / (95.1 - 91.2)
                        }
                        else{
                            hasil = (this.state.tinggiBadan - 95.1) / (98.9 - 95.1)
                        }
                        break;
                    case "37":
                        if(this.state.tinggiBadan < 95.7){
                            hasil = (this.state.tinggiBadan - 95.7) / (95.7 - 91.9)
                        }
                        else{
                            hasil = (this.state.tinggiBadan - 95.7) / (99.6 - 95.7)
                        }
                        break;
                    case "38":
                        if(this.state.tinggiBadan < 96.4){
                            hasil = (this.state.tinggiBadan - 96.4) / (96.4 - 92.5)
                        }
                        else{
                            hasil = (this.state.tinggiBadan - 96.4) / (100.3 - 96.4)
                        }
                        break;
                    case "39":
                        if(this.state.tinggiBadan < 97.1){
                            hasil = (this.state.tinggiBadan - 97.1) / (97.1 - 93.1)
                        }
                        else{
                            hasil = (this.state.tinggiBadan - 97.1) / (101.0- 97.1)
                        }
                        break;
                    case "40":
                        if(this.state.tinggiBadan < 97.7){
                            hasil = (this.state.tinggiBadan - 97.7) / (97.7 - 93.8)
                        }
                        else{
                            hasil = (this.state.tinggiBadan - 97.7) / (101.7- 97.7)
                        }
                        break;
                    case "41":
                        if(this.state.tinggiBadan < 98.4){
                            hasil = (this.state.tinggiBadan - 98.4) / (98.4 - 94.4)
                        }
                        else{
                            hasil = (this.state.tinggiBadan - 98.4) / (102.4- 98.4)
                        }
                        break;
                    case "42":
                        if(this.state.tinggiBadan < 99.0){
                            hasil = (this.state.tinggiBadan - 99.0) / (99.0 - 95.0)
                        }
                        else{
                            hasil = (this.state.tinggiBadan - 99.0) / (103.1 - 99.0)
                        }
                        break;
                    case "43":
                        if(this.state.tinggiBadan < 99.7){
                            hasil = (this.state.tinggiBadan - 99.7) / (99.7 - 95.6)
                        }
                        else{
                            hasil = (this.state.tinggiBadan - 99.7) / (103.8 - 99.7)
                        }
                        break;
                    case "44":
                        if(this.state.tinggiBadan < 100.3){
                            hasil = (this.state.tinggiBadan - 100.3) / (100.3 - 96.2)
                        }
                        else{
                            hasil = (this.state.tinggiBadan - 100.3) / (104.5 - 100.3)
                        }
                        break;
                    case "45":
                        if(this.state.tinggiBadan < 100.9){
                            hasil = (this.state.tinggiBadan - 100.9) / (100.9 - 96.7)
                        }
                        else{
                            hasil = (this.state.tinggiBadan - 100.9) / (105.1 - 100.9)
                        }
                        break;
                    case "46":
                        if(this.state.tinggiBadan < 101.5){
                            hasil = (this.state.tinggiBadan - 101.5) / (101.5 - 97.3)
                        }
                        else{
                            hasil = (this.state.tinggiBadan - 101.5) / (105.8 - 101.5)
                        }
                        break;
                    case "47":
                        if(this.state.tinggiBadan < 102.1){
                            hasil = (this.state.tinggiBadan - 102.1) / (102.1 - 97.9)
                        }
                        else{
                            hasil = (this.state.tinggiBadan - 102.1) / (106.4 - 102.1)
                        }
                        break;
                    case "48":
                        if(this.state.tinggiBadan < 102.7){
                            hasil = (this.state.tinggiBadan - 102.7) / (102.7 - 98.4)
                        }
                        else{
                            hasil = (this.state.tinggiBadan - 102.7) / (107.0 - 102.7)
                        }
                        break;
                    case "49":
                        if(this.state.tinggiBadan < 103.3){
                            hasil = (this.state.tinggiBadan - 103.3) / (103.3 - 99)
                        }
                        else{
                            hasil = (this.state.tinggiBadan - 103.3) / (107.7 - 103.3)
                        }
                        break;
                    case "50":
                        if(this.state.tinggiBadan < 103.9){
                            hasil = (this.state.tinggiBadan - 103.9) / (103.9 - 99.5)
                        }
                        else{
                            hasil = (this.state.tinggiBadan - 103.9) / (108.3 - 103.9)
                        }
                        break;
                    case "51":
                        if(this.state.tinggiBadan < 104.5){
                            hasil = (this.state.tinggiBadan - 104.5) / (104.5 - 100.1)
                        }
                        else{
                            hasil = (this.state.tinggiBadan - 104.5) / (108.9 - 104.5)
                        }
                        break;
                    case "52":
                        if(this.state.tinggiBadan < 105){
                            hasil = (this.state.tinggiBadan - 105) / (105 - 100.6)
                        }
                        else{
                            hasil = (this.state.tinggiBadan - 105) / (109.5 - 105)
                        }
                        break;
                    case "53":
                        if(this.state.tinggiBadan < 105.6){
                            hasil = (this.state.tinggiBadan - 105.6) / (105.6 - 101.1)
                        }
                        else{
                            hasil = (this.state.tinggiBadan - 105.6) / (110.1 - 105.6)
                        }
                        break;
                    case "54":
                        if(this.state.tinggiBadan < 106.2){
                            hasil = (this.state.tinggiBadan - 106.2) / (106.2 - 101.6)
                        }
                        else{
                            hasil = (this.state.tinggiBadan - 106.2) / (110.7 - 106.2)
                        }
                        break;
                    case "55":
                        if(this.state.tinggiBadan < 106.7){
                            hasil = (this.state.tinggiBadan - 106.7) / (106.7 - 102.2)
                        }
                        else{
                            hasil = (this.state.tinggiBadan - 106.7) / (111.3 - 106.7)
                        }
                        break;
                    case "56":
                        if(this.state.tinggiBadan < 107.3){
                            hasil = (this.state.tinggiBadan - 107.3) / (107.3 - 102.7)
                        }
                        else{
                            hasil = (this.state.tinggiBadan - 107.3) / (111.3 - 107.3)
                        }
                        break;
                    case "57":
                        if(this.state.tinggiBadan < 107.8){
                            hasil = (this.state.tinggiBadan - 107.8) / (107.8 - 103.2)
                        }
                        else{
                            hasil = (this.state.tinggiBadan - 107.8) / (112.5 - 107.8)
                        }
                        break;
                    case "58":
                        if(this.state.tinggiBadan < 108.4){
                            hasil = (this.state.tinggiBadan - 108.4) / (108.4 - 103.7)
                        }
                        else{
                            hasil = (this.state.tinggiBadan - 108.4) / (113.0 - 108.4)
                        }
                        break;
                    case "59":
                        if(this.state.tinggiBadan < 108.9){
                            hasil = (this.state.tinggiBadan - 108.9) / (108.9 - 104.2)
                        }
                        else{
                            hasil = (this.state.tinggiBadan - 108.9) / (113.6- 108.9)
                        }
                        break;
                    case "60":
                        if(this.state.tinggiBadan < 109.4){
                            hasil = (this.state.tinggiBadan - 109.4) / (109.4 - 104.7)
                        }
                        else{
                            hasil = (this.state.tinggiBadan - 109.4) / (114.2- 109.4)
                        }
                        break;
                }
            }
            if(hasil < -3){
                hasilText = 'Sangat Pendek';
            }
            else if(hasil >= -3 && hasil < -2){
                hasilText = 'Pendek';
            }
            else if(hasil >= -2 && hasil < 2){
                hasilText = 'Normal'
            }
            else {
                hasilText = 'Tinggi'
            }
            

        }
        return [hasilText, hasil]
    }
    //Ketika tomgol tambah ditekan
    onSubmit(){

        //Hitung deteksi stunting
        const hasil = this.hitungStunting(this.state.tinggiBadan, this.state.beratBadan, this.state.jenisKelamin, this.state.usia)
        console.log(hasil)

        //Mendapatkan tanggal sekatang
        let dateNow = new Date();
        
        let tanggalSekarang = JSON.stringify(dateNow)
        tanggalSekarang = tanggalSekarang.slice(1, 11)
        tanggalSekarang = tanggalSekarang.split("-")
        const tanggal = tanggalSekarang[2]
        const bulan = tanggalSekarang[1]
        const tahun = tanggalSekarang[0]
        tanggalSekarang = tanggal + '/' + bulan + '/' + tahun

        console.log(tanggalSekarang)

        //Update data pertumbuhan di database
        const postData = {
            usia: this.state.usia,
            tinggi: this.state.tinggiBadan,
            berat: this.state.beratBadan,
            diperbaruiPada: tanggalSekarang,
            hasil: hasil[0],
        }
        const dbRef = ref(getDatabase());
        const updates = {};
        updates['/dataAnggota/' + this.state.idAnggota + '/pertumbuhan/bulan' + this.state.usia] = postData;
        update(dbRef, updates);

        if (hasil[0] == 'Sangat Pendek' || hasil[0] == 'Pendek') {
            const updatesStunting = {}
            updatesStunting['/dataAnggota/' + this.state.idAnggota + '/kondisi'] = "Stunting";
            update(dbRef, updatesStunting);
        }
        else{
            const updatesNormal = {}
            updatesNormal['/dataAnggota/' + this.state.idAnggota + '/kondisi'] = "Normal";
            update(dbRef, updatesNormal);
        }
        
        this.props.navigation.navigate('Hasil', {
            hasil: hasil[0],
            tinggi: this.state.tinggiBadan,
            berat: this.state.beratBadan,
            usia: this.state.usia,
            jenisKelamin: this.state.jenisKelamin,
            zScore: hasil[1].toFixed(2)
        })
    }

    render() {
        
        const {modalVisible} = this.state
        if(this.state.isLoad){
            return(
                <Text>Loading</Text>
            )
        }
        else{
        return (
        <View style={styles.container}>
            {this.state.isUser &&
                <Text style={styles.judul}>Update Data {this.state.namaUser}</Text>
            }
            
            {!this.state.isUser &&
                <Text style={styles.judul}>Update Data Pertumbuhan</Text>
            }
            {!this.state.isUser &&
                <View>
                <Text style={styles.label}>Nama</Text>
                <TextInput
                    style={styles.textInput}
                    value= {this.state.nama}
                    editable = {false}
                />
                <Text style={styles.label}>NIK</Text>
                <TextInput
                    style={styles.textInput}
                    value= {this.state.nik}
                    editable = {false}
                />
                <Text style={styles.label}>Jenis Kelamin</Text>
                <TextInput
                    style={styles.textInput}
                    value= {this.state.jenisKelamin}
                    editable = {false}
                />
                
            
                <TouchableOpacity style={styles.tombolPilih} onPress={()=> this.setState({modalVisible: true})}>
                    <Text style={styles.textTombolPilih}>Pilih Anak</Text>
                </TouchableOpacity>
                </View>
            }
            <Text style={styles.label}>Usia</Text>
            <View style={styles.picker}>
                <Picker
                    selectedValue={this.state.jenisKelamin}
                    onValueChange={(itemValue, itemIndex) => this.setState({...this.state, usia: itemValue})}
                >
                    <Picker.Item label="Pilih Usia" value="0" />
                    <Picker.Item label="24 Bulan" value="24" />
                    <Picker.Item label="25 Bulan" value="25" />
                    <Picker.Item label="26 Bulan" value="26" />
                    <Picker.Item label="27 Bulan" value="27" />
                    <Picker.Item label="28 Bulan" value="28" />
                    <Picker.Item label="29 Bulan" value="29" />
                    <Picker.Item label="30 Bulan" value="30" />
                    <Picker.Item label="31 Bulan" value="31" />
                    <Picker.Item label="32 Bulan" value="32" />
                    <Picker.Item label="33 Bulan" value="33" />
                    <Picker.Item label="34 Bulan" value="34" />
                    <Picker.Item label="35 Bulan" value="35" />
                    <Picker.Item label="36 Bulan" value="36" />
                    <Picker.Item label="37 Bulan" value="37" />
                    <Picker.Item label="38 Bulan" value="38" />
                    <Picker.Item label="39 Bulan" value="39" />
                    <Picker.Item label="40 Bulan" value="40" />
                    <Picker.Item label="41 Bulan" value="41" />
                    <Picker.Item label="42 Bulan" value="42" />
                    <Picker.Item label="43 Bulan" value="43" />
                    <Picker.Item label="44 Bulan" value="44" />
                    <Picker.Item label="45 Bulan" value="45" />
                    <Picker.Item label="46 Bulan" value="46" />
                    <Picker.Item label="47 Bulan" value="47" />
                    <Picker.Item label="48 Bulan" value="48" />
                    <Picker.Item label="49 Bulan" value="49" />
                    <Picker.Item label="50 Bulan" value="50" />
                    <Picker.Item label="51 Bulan" value="51" />
                    <Picker.Item label="52 Bulan" value="52" />
                    <Picker.Item label="53 Bulan" value="53" />
                    <Picker.Item label="54 Bulan" value="54" />
                    <Picker.Item label="55 Bulan" value="55" />
                    <Picker.Item label="56 Bulan" value="56" />
                    <Picker.Item label="57 Bulan" value="57" />
                    <Picker.Item label="58 Bulan" value="58" />
                    <Picker.Item label="59 Bulan" value="59" />
                    <Picker.Item label="60 Bulan" value="60" />  
                </Picker>
            </View>
            <Text style={styles.label}>Tinggi Badan (cm)</Text>
            <TextInput
                style={styles.textInput}
                onChangeText={(text) => this.setState({tinggiBadan: text})}
                keyboardType={'number-pad'}
            />
            <Text style={styles.label}>Berat Badan (kg)</Text>
            <TextInput
                style={styles.textInput}
                onChangeText={(text) => this.setState({beratBadan: text})}
                keyboardType={'number-pad'}
            />
            <Modal
                isVisible={modalVisible}
                onBackdropPress={() => this.setState({modalVisible: !modalVisible})}
            >
                <View style={styles.containerModal}>
                    <Text style={styles.headingModal}>Pilih Anak</Text>
                    <View>
                        <TextInput placeholder="Cari..." value={this.state.searchText} onChangeText={this.search} style={styles.formCari}></TextInput>
                        <FontAwesomeIcon icon={ faSearch } style={styles.iconCari} />
                    </View>
                    <FlatList
                        showsVerticalScrollIndicator={false}
                        data={Object.keys(this.state.dataFilltered)}
                        renderItem = {({item}) => {
                            return(
                                <SkeletonContent
                                    containerStyle={{ flex: 1}}
                                    isLoading={this.state.isLoad}
                                    layout={[
                                        { 
                                            key: 'someId', 
                                            width: '100%', 
                                            borderRadius: 10, 
                                            marginBottom: 6, 
                                            flexDirection: 'row', 
                                            alignItems: 'center',
                                            marginTop: 10,
                                            paddingHorizontal: 20,
                                            paddingVertical: 10,
                                            children: [
                                                {  
                                                    width: 50, 
                                                    height: 50, 
                                                    borderRadius: 25,
                                                    marginBottom: 6,
                                                    marginLeft: 10,
                                                },
                                                {
                                                    flexDirection: 'column',
                                                    width: '100%',
                                                    children: [
                                                        {
                                                            width: '100%', 
                                                            height: 20, 
                                                            marginBottom: 6,
                                                            marginLeft: 30,
                                                        },
                                                        {
                                                            width: '60%', 
                                                            height: 13, 
                                                            marginBottom: 6,
                                                            marginLeft: 30,
                                                        },
                                                        {
                                                            width: '40%', 
                                                            height: 10, 
                                                            marginBottom: 6,
                                                            marginLeft: 30,
                                                        },
                                                    ]
                                                }
                                            ]
                                        }
                                    ]}
                                >
                                <TouchableOpacity style={styles.itemBox} onPress={() => this.onAnakSelected(this.state.data[item].idAnggota, this.state.data[item].nama, this.state.data[item].nik, this.state.data[item].jenisKelamin)}>
                                    <View>
                                        <Image source={{uri: this.state.data[item].urlFoto}} style={styles.imgItem}/>
                                    </View>
                                    <View style={styles.textItem}>
                                        <Text style={styles.textItemHead1}>{this.state.data[item].nama}</Text>
                                        <Text style={styles.textItemHead2}>NIK. {this.state.data[item].nik}</Text>
                                        <Text style={styles.textItemParagraph}>{this.state.data[item].jenisKelamin}</Text>
                                    </View>
                                </TouchableOpacity>
                                </SkeletonContent>  
                            )
                        }}
                        keyExtractor={(item) => item}
                    />
                    <TouchableOpacity style={styles.tombolTutup} onPress={() => this.setState({modalVisible: !modalVisible})}>
                        <FontAwesomeIcon icon={ faX } style={styles.iconTutup} />
                    </TouchableOpacity>
                </View>
            </Modal>
            <TouchableOpacity style={styles.tombolTambah} onPress={() => this.onSubmit()}>
                <Text style={styles.textTombolTambah}>Update Pertumbuhan</Text>
            </TouchableOpacity>
        </View>
        )
    }
}
}

const width = Dimensions.get('window').width
const height = Dimensions.get('window').height

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 20,
        paddingVertical: 20,
    },
    judul: {
        fontSize: 25,
        fontFamily: 'Poppins-Bold',
        color: '#444',
        marginTop: 30,
    },
    label: {
        marginTop: 20,
        fontFamily: 'Poppins-Bold',
        paddingLeft: 3,
        color: '#444'
    },
    textInput: {
        backgroundColor: '#ddeeee',
        paddingHorizontal: 20,
        paddingVertical: 10,
        fontFamily: 'Poppins-Reg',
        borderRadius: 7,
        marginTop: 3,
    },
    tombolTambah: {
        backgroundColor: '#5669ff',
        paddingHorizontal: 20,
        paddingTop: 13,
        paddingBottom: 12,
        borderRadius: 7,
        marginTop: 20,
        justifyContent: 'center',
        alignItems: 'center'
    },
    textTombolTambah: {
        fontFamily: 'Poppins-Bold',
        fontSize: 16,
        color: '#fff'
    },
    tombolPilih: {
        backgroundColor: '#b2e2f7',
        paddingHorizontal: 20,
        paddingTop: 13,
        paddingBottom: 12,
        borderRadius: 7,
        marginTop: 20,
        justifyContent: 'center',
        alignItems: 'center'
    },
    textTombolPilih: {
        fontFamily: 'Poppins-Bold',
        fontSize: 16,
        color: '#444'
    },
    containerModal: {
        backgroundColor: '#f3f3f3',
        paddingHorizontal: 20,
        paddingVertical: 20,
        borderRadius: 7,
        maxHeight: height - 70
    },
    headingModal: {
        fontSize: 20,
        fontFamily: 'Poppins-Bold',
        color: '#444'
    },
    itemBox: {
        width: '100%',
        backgroundColor: '#fff',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 10,
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
    },
    imgItem: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginLeft: 10,
    },
    textItem: {
        marginLeft: 30,
        flexShrink: 1
    },
    textItemHead1: {
        fontFamily: 'Poppins-Bold',
        fontSize: 20,
        color: '#333',
    },
    textItemHead2: {
        fontFamily: 'Poppins-Reg',
        fontSize: 14,
        color: '#5669ff',
    },
    textItemParagraph: {
        textAlign: 'justify',
        fontFamily: 'Poppins-Reg',
        color: '#999'
    },
    formCari: {
        backgroundColor: '#fff',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 7,
    },
    iconCari: {
        position: 'absolute',
        right: 15,
        top: 15,
        color: '#444'
    },
    tombolTutup: {
        width: 40,
        height: 30,
        borderTopEndRadius: 7,
        borderBottomStartRadius: 7,
        backgroundColor: '#5669ff',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        top: 0,
        right: 0,
    },
    iconTutup: {
        color: '#fff'
    },
    picker: {
        color: '#444',
        backgroundColor: '#ddeeee',
        borderRadius: 7,
    }
})

export default TambahPertumbuhan