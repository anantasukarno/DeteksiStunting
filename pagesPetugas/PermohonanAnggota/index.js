import { Text, View, StyleSheet, Image, FlatList, TouchableOpacity, Alert, TextInput } from 'react-native'
import React, { Component } from 'react'
import { getDatabase, ref, child, get, remove, query, orderByChild, equalTo, onValue, update } from "firebase/database";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faCheck, faX, faEye, faSearch, faArrowLeft } from '@fortawesome/free-solid-svg-icons'

import AsyncStorage from '@react-native-async-storage/async-storage';


export class PermohonanAnggota extends Component {
    constructor(props){
        super(props);
        this.state = {
            data: [],
            dataFilltered: [],
            idUser: '',
            wilayah: '',
        }
    }

    async componentDidMount(){
        await this.getPetugas();
        this.getData()
    }

    //Mendapatkan identitas petugas
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

    getData() {
        const dbRef = ref(getDatabase());
        const db = getDatabase()
        const refAnggota = query(ref(db, "dataAnggota"), orderByChild("status"), equalTo("permohonan"))
        onValue(refAnggota, (snapshot) => {
            this.setState({
                data: snapshot.val(),
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

    //ketika tombol disetujui ditekan
    onSetujui(id){
        const postData = {
            status: 'disetujui'
        }
        const dbRef = ref(getDatabase());
        const updates = {};
        updates['/dataAnggota/' + id + '/status'] = 'disetujui';
        update(dbRef, updates);
        updates['/dataAnggota/' + id + '/level'] = 'anggota';
        update(dbRef, updates);
        Alert.alert('Sukses', 'Anggota Berhasil disetujui');
        updates['/users/' + id + '/status'] = 'disetujui';
        update(dbRef, updates);
        Alert.alert('Sukses', 'Anggota Berhasil disetujui');


        this.props.navigation.replace('PermohonanAnggota')
    }

    //ketika tombol tolak ditekan
    onTolak(id){
        const dbRef = ref(getDatabase());
        remove(child(dbRef, `dataAnggota/${id}`))
        .then(() => {
            Alert.alert('Sukses', 'Data Berhasil Dihapus');
            this.props.navigation.replace('PermohonanAnggota')
        })
        .catch(() => {
            Alert.alert('Gagal', 'Data Gagal Dihapus');
            this.props.navigation.replace('PermonanAnggota')
        })
        remove(child(dbRef, `users/${id}`))
        .then(() => {
            Alert.alert('Sukses', 'Data Berhasil Dihapus');
            this.props.navigation.replace('PermohonanAnggota')
        })
        .catch(() => {
            Alert.alert('Gagal', 'Data Gagal Dihapus');
            this.props.navigation.replace('PermonanAnggota')
        })
    }

    render() {
        console.log(this.state.dataFilltered)
        if(Object.keys(this.state.dataFilltered).length > 0){
            return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                        <FontAwesomeIcon icon={ faArrowLeft } size={20}/>
                    </TouchableOpacity>
                    <Text style={styles.judul}>Permohonan Anggota</Text>
                </View>
                <View>
                    <TextInput placeholder="Cari..." value={this.state.searchText} onChangeText={this.search} style={styles.formCari}></TextInput>
                    <FontAwesomeIcon icon={ faSearch } style={styles.iconCari} />
                </View>
                <FlatList
                    data={Object.keys(this.state.dataFilltered)}
                    renderItem = {({item}) => {
                        return(
                            <View style={styles.wrapperItem}>
                                <View style={styles.itemBox}>
                                    <View>
                                        <Image source={{uri: this.state.data[item].urlFoto}} style={styles.imgItem}/>
                                    </View>
                                    <View style={styles.textItem}>
                                        <Text style={styles.textItemHead1}>{this.state.data[item].nama}</Text>
                                        <Text style={styles.textItemHead2}>{this.state.data[item].nik}</Text>
                                        <Text style={styles.textItemParagraph}>{this.state.data[item].jenisKelamin}</Text>
                                    </View>
                                </View>
                                <View style={styles.wrapperAksi}>
                                    <TouchableOpacity style={styles.aksi1} onPress={() => Alert.alert('Setujui Anggota', 'Yakin ingin menyetujui anggota?', [{
                                        text: 'Tidak',
                                        onPress: () => console.log('Tidak Menghapus')
                                    },
                                    {
                                        text: 'Setujui',
                                        onPress: () => this.onSetujui(item)
                                    }
                                    ])}>
                                        <FontAwesomeIcon icon={ faCheck } style={styles.textAksi1} />
                                        <Text style={styles.textAksi1} >Setujui</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.aksi2} onPress={() => this.props.navigation.navigate('DetailAnggota', {
                                        idAnggota: this.state.data[item].idAnggota
                                    })}>
                                        <FontAwesomeIcon icon={ faEye } style={styles.textAksi2} />
                                        <Text style={styles.textAksi2}>Detail</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.aksi3} onPress={() => Alert.alert('Tolak Anggota', 'Yakin ingin menolak anggota?', [{
                                        text: 'Tidak',
                                        onPress: () => console.log('Tidak Menghapus')
                                    },
                                    {
                                        text: 'Tolak',
                                        onPress: () => this.onTolak(item)
                                    }
                                    ])}>
                                        <Text style={styles.textAksi3}>Tolak</Text>
                                    </TouchableOpacity>
                                    
                                </View>
                            </View>  
                        )
                    }}
                    keyExtractor={(item) => item}
                />
            </View>
            )
        }
        else{
            return(
                <View style={styles.container2}>
                    <Image source={require(`../../assets/nodata.png`)} style={styles.noDataImg}></Image>
                    <Text style={styles.noDataText1}>Data Tidak Ditemukan</Text>
                    <Text style={styles.noDataText2}>Hal ini disebabkan tidak adanya permohonan anggota</Text>
                </View>
            )
        }
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
    wrapperItem: {
        width: '100%',
        backgroundColor: '#fff',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 10,
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
    itemBox: {
        flexDirection: 'row',
        alignItems: 'center',
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
    wrapperAksi: {
        flexDirection: 'row-reverse',
        justifyContent: 'space-around',
        marginTop: 10,
    },
    aksi1: {
        backgroundColor: "#5669ff",
        width: '30%',
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
        marginLeft: 5,
        flexDirection: 'row',
        justifyContent: 'space-evenly'
    },
    textAksi1: {
        color: '#fff',
        fontWeight: 'bold'
    },
    aksi2: {
        borderColor: "#5669ff",
        borderWidth: 2,
        width: '30%',
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
        marginLeft: 5,
        flexDirection: 'row',
        justifyContent: 'space-evenly'
    },
    textAksi2: {
        color: '#5669ff',
        fontWeight: 'bold'
    },
    aksi3: {
        width: '30%',
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
        marginLeft: 5,
        flexDirection: 'row',
        justifyContent: 'space-evenly'
    },
    textAksi3: {
        color: '#999',
        fontWeight: 'bold'
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
    container2: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    noDataImg: {
        width: 200,
        height: 200
    },
    noDataText1: {
        color: '#5669ff',
        fontFamily: 'Poppins-Bold',
        fontSize: 25,
    },
    noDataText2: {
        color: '#444',
        fontFamily: 'Poppins-Reg',
        fontSize: 13,
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
export default PermohonanAnggota