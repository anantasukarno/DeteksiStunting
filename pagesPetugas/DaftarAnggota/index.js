import { Text, View, StyleSheet, Image, FlatList, TouchableOpacity, SearchBar, TextInput } from 'react-native'
import React, { Component } from 'react'
import { getDatabase, ref, child, get, remove, query, orderByChild, equalTo, onValue } from "firebase/database";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faSearch, faUser,faPlus, faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import SkeletonContent from 'react-native-skeleton-content';
import AsyncStorage from '@react-native-async-storage/async-storage';


export class DaftarAnggota extends Component {
    constructor(props){
        super(props);
        this.state = {
            data: [],
            dataFilltered: [],
            periksaPermohonan: {},
            jumlahPermohonan: 0,
            isLoad: true,
            searchText: '',
            wilayah: '',
            idUser: '',
            kelurahan: '',
            kecamatan: '',
            mode: 'semua',
            puskesmas: '',
        }
    }

    async componentDidMount(){
        await this.getPetugas();
        this.getData()
        this.periksaPermohonan()

        // const kelurahan = await AsyncStorage.getItem('desa')
        const puskesmas = await AsyncStorage.getItem('kecamatan')
        this.setState({
            puskesmas: puskesmas,
        })
        setTimeout(() => this.setState({ isLoad: false}), 1000)
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
        } else {
            console.log("No data available");
        }
        }).catch((error) => {
        console.error(error);
        });
    }

    //Untuk memeriksa jumlah permohonan anggota
    periksaPermohonan(){
        const dbRef = ref(getDatabase());
        const db = getDatabase()
        const refAnggota = query(ref(db, "dataAnggota"), orderByChild("status"), equalTo("permohonan"))
        onValue(refAnggota, (snapshot) => {
            this.setState({
                periksaPermohonan: snapshot.val(),
            })
            if(this.state.periksaPermohonan){
                const jumlahPermohonan = Object.keys(this.state.periksaPermohonan).length
                this.setState({
                    jumlahPermohonan: jumlahPermohonan,
                })
            }
          }, {
            onlyOnce: true
        });
    }

    //Mengambil data anggota
    getData() {
        const dbRef = ref(getDatabase());
        const db = getDatabase()
        const refAnggota = query(ref(db, "dataAnggota"), orderByChild("level"), equalTo("anggota"))
        onValue(refAnggota, async (snapshot) => {
            await this.setState({
                ...this.state,
                data: snapshot.val(),
                dataFilltered: snapshot.val()
            })
            if (this.state.data) {
            const asArray = Object.entries(this.state.data);
            const filtered = asArray.filter((item) => {
                return item[1].puskesmas.toLowerCase().includes(this.state.wilayah.toLowerCase())
            });
            const justStrings = Object.fromEntries(filtered);
            this.setState({
                data: justStrings,
                dataFilltered: justStrings
            })
            
            // if(this.state.mode == 'semua'){
            //     this.setState({
            //         data: justStrings,
            //         dataFilltered: justStrings 
            //     })
            // }
            // else{
            //     const arrayData = Object.entries(this.state.dataFilltered);
            //     const filterMode = arrayData.filter((item) => {
            //         return item[1].pertumbuhan.kelurahan.toLowerCase().includes(this.state.wilayah.toLowerCase())
            //     });
            //     const justStrings = Object.fromEntries(filtered);
            //     this.setState({
            //         data: justStrings,
            //         dataFilltered: justStrings
            //     })
            // }
        }
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
    render() {
        return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                    <FontAwesomeIcon icon={ faArrowLeft } size={20}/>
                </TouchableOpacity>
                <Text style={styles.judul}>Daftar Anggota</Text>
            </View>
            <View>
                <TextInput placeholder="Cari..." value={this.state.searchText} onChangeText={this.search} style={styles.formCari}></TextInput>
                <FontAwesomeIcon icon={ faSearch } style={styles.iconCari} />
            </View>
            <Text style={styles.paragraf}>Data Anak Puskesmas {this.state.puskesmas}</Text>
            <FlatList
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
                        <View style={styles.itemBox}>
                            <View>
                                <Image source={{uri: this.state.data[item].urlFoto}} style={styles.imgItem}/>
                            </View>
                            <View style={styles.textItem}>
                                <Text style={styles.textItemHead1}>{this.state.data[item].nama}</Text>
                                <Text style={styles.textItemHead2}>NIK. {this.state.data[item].nik}</Text>
                                <Text style={styles.textItemParagraph}>{this.state.data[item].jenisKelamin}</Text>
                            </View>
                            <TouchableOpacity style={styles.aksi} onPress={() => this.props.navigation.navigate('DetailAnggota', {
                                idAnggota: this.state.data[item].idAnggota
                            })}>
                                <Text style={styles.textAksi}>Detail</Text>
                            </TouchableOpacity>
                        </View>
                        </SkeletonContent>  
                    )
                }}
                keyExtractor={(item) => item}
            />
                <TouchableOpacity style={styles.tombolTambah} onPress={() => this.props.navigation.navigate('TambahAnggota')}>
                    <FontAwesomeIcon icon={ faPlus } style={styles.textTombolTambah} />
                </TouchableOpacity>
        </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f3f3f3',
        paddingHorizontal: 20,
    },
    header: {
        flexDirection: 'row',
        marginTop: 40,
        marginBottom: 10,
        alignItems: 'center'
    },
    judul: {
        color: '#333',
        fontFamily: 'Poppins-Bold',
        fontSize: 25,
        marginTop: 3,
        marginLeft: 10,
    },
    paragraf: {
        fontFamily: 'Poppins-Reg',
        color: '#888',
        marginTop: 20,
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
        shadowColor: "#999",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.13,
        shadowRadius: 2.62,
        elevation: 4,
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
    aksi: {
        position: 'absolute',
        right: 30,
        backgroundColor: "#5669ff",
        paddingHorizontal: 15,
        paddingVertical: 7,
        borderRadius: 7,
    },
    textAksi: {
        color: '#fff',
    },
    tombolTambah: {
        width: 60,
        height: 60,
        borderRadius: 60/2,
        backgroundColor: '#5669ff',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        bottom: 40,
        right: 40,
    },
    textTombolTambah: {
        color: '#fff',
        fontSize: 40,

    },
    notif: {
        width: 23,
        height: 23,
        backgroundColor: '#edc124',
        borderRadius: 12.5,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        top: 0,
        right: 0,
    },
    formCari: {
        backgroundColor: '#fff',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 7,
        shadowColor: "#999",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.13,
        shadowRadius: 2.62,
        elevation: 4,
    },
    iconCari: {
        position: 'absolute',
        right: 15,
        top: 15,
        color: '#444',
        elevation: 5,
    }
})
export default DaftarAnggota