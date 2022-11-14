import { Text, View, Dimensions, StyleSheet, TouchableOpacity, Picker, ScrollView } from 'react-native'
import React, { Component } from 'react'
import {
    LineChart,
    BarChart,
    PieChart,
    ProgressChart,
    ContributionGraph,
    StackedBarChart
  } from "react-native-chart-kit";
import { getDatabase, ref, child, get, remove, query, orderByChild, equalTo, onValue } from "firebase/database";
import { Table, TableWrapper, Row, Rows, Col, Cols, Cell } from 'react-native-table-component';

export class PersebaranStunting extends Component {
    constructor(props){
        super(props);
        this.state = {
            dataAnggota: {},
            dataWilayah: {},
            keyWilayah: [],
            jumlahStunting: [],
            jumlahStuntingDistrik: [],
            isLoad: true,
            dataAnggotaFilteredPuskesmas: {},
            active: 'Puskesmas',
            dataDistrik: {},
            keyDistrik: [],
            dataAnggotaFilteredDistrik: {},
            distrik: '',
            jumlahStuntingSementaraDistrik: [],
            dataKampung: {},
            keyKampung: [],
            jumlahStuntingKampung: [],
            dataAnggotaFilteredKampung: {},
            headTable: ['Nama Puskesmas', 'Jumlah Anak', 'Jumlah Stunting', 'Prevelensi Stunting' ],
            dataTablePuskesmas: [],
            dataTableDistrik: [],
            dataTableKampung: [],
            jumlahAnakPuskesmas: [],
            jumlahAnakDistrik: [],
            jumlahAnakKampung: [],
            isTableLoad: true
        }
    }

    async componentDidMount(){
        await this.getData();
        await this.getWilayah();
        await this.getDistrikAll();
        await this.getKampungAll();
        await this.getStuntingChart();
        await this.getTableStunting();
        

        this.setState({
            isLoad: false
        })
    }

    componentDidUpdate(){
      
    }

    //mengambil semua data anggota dari database
    async getData(){
        const dbRef = await ref(getDatabase());
        await get(child(dbRef, `dataAnggota`)).then((snapshot) => {
          if (snapshot.exists()) {
            this.setState({
                dataAnggota: snapshot.val()
            })
          } else {
            console.log("No data available");
          }
        }).catch((error) => {
          console.error(error);
        });
    }

    //mengambil data puskesmas
    async getWilayah(){
        const dbRef = await ref(getDatabase());
        await get(child(dbRef, `dataPuskesmas/`)).then(async (snapshot) => {
            let keyWilayah = await Object.keys(snapshot.val())
            if (snapshot.exists()) {
                this.setState({
                    dataWilayah: snapshot.val(),
                    keyWilayah: keyWilayah
                })
            } else {
                console.log("No data available");
            }
        }).catch((error) => {
          console.error(error);
        });
    }

    //mengambil data distrik
    getDistrikAll(){
        let newObj = {}
        for(let i = 0; i < this.state.keyWilayah.length; i++){
            newObj = Object.assign(newObj, this.state.dataWilayah[this.state.keyWilayah[i]].distrik);
        }
        let keyDistrik = Object.keys(newObj)
        this.setState({
            dataDistrik: newObj,
            keyDistrik: keyDistrik
        })
    }
    
    getKampungAll(){
        let newObj = {}
        for(let i = 0; i < this.state.keyWilayah.length; i++){
            for (let j = 0; j < this.state.keyDistrik.length; j++) {
                let distrik = this.state.keyDistrik[j];
                newObj = Object.assign(newObj, this.state.dataDistrik[distrik].kampung)
            }

        }
        let keyKampung = Object.keys(newObj)
        this.setState({
            dataKampung: newObj,
            keyKampung: keyKampung,
        })
    }


    //menseleksi jumlah stunting per puskesmas
    async getJumlahStuntingPuskesmas(tempat){
        if (this.state.dataAnggota) {
            await this.setState({
                jumlahStunting: []
            })
            let asArray = Object.entries(this.state.dataAnggota);
            let filtered = asArray.filter((item) => {
                return item[1].puskesmas.toLowerCase().includes(tempat.toLowerCase())
            });
            let justStrings = Object.fromEntries(filtered);
            this.setState({
                dataAnggotaFilteredPuskesmas: justStrings,
            })

            this.state.jumlahAnakPuskesmas.push(filtered.length)

            asArray = Object.entries(this.state.dataAnggotaFilteredPuskesmas)
            filtered = asArray.filter((item) => {
                return item[1].kondisi.toLowerCase().includes('Stunting'.toLowerCase())
            });
            return(filtered.length)
            
        }
    }

    //menseleksi jumlah stunting per distrik
    async getJumlahStuntingDistrik(tempat){
        if (this.state.dataAnggota) {
            await this.setState({
                jumlahStuntingDistrik: []
            })
            let asArray = Object.entries(this.state.dataAnggota);
            let filtered = asArray.filter((item) => {
                return item[1].alamat.distrik.toLowerCase().includes(tempat.toLowerCase())
            });
            let justStrings = Object.fromEntries(filtered);
            this.setState({
                dataAnggotaFilteredDistrik: justStrings,
            })

            this.state.jumlahAnakDistrik.push(filtered.length)

            asArray = Object.entries(this.state.dataAnggotaFilteredDistrik)
            filtered = asArray.filter((item) => {
                return item[1].kondisi.toLowerCase().includes('Stunting'.toLowerCase())
            });
            await this.state.jumlahStuntingDistrik.push(filtered.length)
            // console.log(this.state.jumlahStuntingDistrik)
            return(filtered.length)
        }
    }

    //menseleksi jumlah stunting per distrik
    async getJumlahStuntingKampung(tempat){
        if (this.state.dataAnggota) {
            await this.setState({
                jumlahStuntingKampung: []
            })
            let asArray = Object.entries(this.state.dataAnggota);
            let filtered = asArray.filter((item) => {
                return item[1].alamat.kampung.toLowerCase().includes(tempat.toLowerCase())
            });
            let justStrings = Object.fromEntries(filtered);
            this.setState({
                dataAnggotaFilteredKampung: justStrings,
            })

            this.state.jumlahAnakKampung.push(filtered.length)

            asArray = Object.entries(this.state.dataAnggotaFilteredKampung)
            filtered = asArray.filter((item) => {
                return item[1].kondisi.toLowerCase().includes('Stunting'.toLowerCase())
            });
            await this.state.jumlahStuntingKampung.push(filtered.length)
            return(filtered.length)
        }
    }

    async getStuntingChart(){
        if (this.state.active == 'Puskesmas') {
            let jumlahStunt = []
            for (let i = 0; i < this.state.keyWilayah.length; i++) {
                let jumlahStuntTemp = await this.getJumlahStuntingPuskesmas(this.state.keyWilayah[i])
                jumlahStunt.push(jumlahStuntTemp)
            }
            this.setState({
                jumlahStunting: jumlahStunt
            })
        }
        else if(this.state.active == 'Distrik'){
            let jumlah = []
            for (let i = 0; i < this.state.keyDistrik.length; i++) {
                let jumlahTemp = await this.getJumlahStuntingDistrik(this.state.keyDistrik[i])
                jumlah.push(jumlahTemp)
            }
            this.setState({
                jumlahStuntingDistrik: jumlah,
            })
        }
        else if(this.state.active == 'Kampung'){
            console.log('Hi')
            let jumlahKamp = []
            for (let i = 0; i < this.state.keyKampung.length; i++) {
                let jumlahTempKamp = await this.getJumlahStuntingKampung(this.state.keyKampung[i])
                jumlahKamp.push(jumlahTempKamp)
            }
            this.setState({
                jumlahStuntingKampung: jumlahKamp,
            })
        }
    }

   getTableStunting(){
    if(this.state.active == 'Puskesmas'){
        for(let i = 0; i < this.state.keyWilayah.length; i++){
            let persen = (this.state.jumlahStunting[i] / this.state.jumlahAnakPuskesmas[i]) * 100
            let data = [this.state.keyWilayah[i], this.state.jumlahAnakPuskesmas[i], this.state.jumlahStunting[i], `${persen}%`]
            this.state.dataTablePuskesmas.push(data)
        }
        this.setState({
            isTableLoad: false
        })
    }
    else if(this.state.active == 'Distrik'){
        for(let i = 0; i < this.state.keyDistrik.length; i++){
            let persen = (this.state.jumlahStuntingDistrik[i] / this.state.jumlahAnakDistrik[i]) * 100
            let data = [this.state.keyDistrik[i], this.state.jumlahAnakDistrik[i], this.state.jumlahStuntingDistrik[i], `${persen}%`]
            this.state.dataTableDistrik.push(data)
        }
        this.setState({
            isTableLoad: false
        })
    }
    else if(this.state.active == 'Kampung'){
        for(let i = 0; i < this.state.keyKampung.length; i++){
            let persen = (this.state.jumlahStuntingKampung[i] / this.state.jumlahAnakKampung[i]) * 100;
            let kampung = this.state.keyKampung[i];
            kampung = kampung.split("_")
            kampung = kampung.join(" ")
            let data = [kampung, this.state.jumlahAnakKampung[i], this.state.jumlahStuntingKampung[i], `${persen}%`]
            this.state.dataTableKampung.push(data)
        }
        this.setState({
            isTableLoad: false
        })
    }
    
   } 

  render() {
    console.log(this.state.jumlahAnakDistrik)
    if(this.state.isLoad){
        return(
            <Text>Loading</Text>
        )
    }
    else{
        return (
        <View style={styles.container}>
            <Text style={styles.heading1}>Persebaran Stunting</Text>
            <View style={styles.wrapperButton}>
                <TouchableOpacity style={this.state.active === 'Puskesmas' ? styles.buttonActive : styles.button} onPress={async () => {await this.setState({active: 'Puskesmas'})
                await this.getStuntingChart();
                this.getTableStunting()}}>
                    <Text style={this.state.active === 'Puskesmas' ? styles.textButtonActive : styles.textButton}>Puskesmas</Text>
                </TouchableOpacity>
                <TouchableOpacity style={this.state.active === 'Distrik' ? styles.buttonActive : styles.button} onPress={async() => {
                    await this.setState({active: 'Distrik'})
                    await this.getStuntingChart()
                    this.getTableStunting();
                    }}>
                    <Text style={this.state.active === 'Distrik' ? styles.textButtonActive : styles.textButton}>Distrik</Text>
                </TouchableOpacity>
                <TouchableOpacity style={this.state.active === 'Kampung' ? styles.buttonActive : styles.button} onPress={async () => {await this.setState({active: 'Kampung'})
                await this.getStuntingChart();
                this.getTableStunting()}}>
                    <Text style={this.state.active === 'Kampung' ? styles.textButtonActive : styles.textButton}>Kampung</Text>
                </TouchableOpacity>
            </View>
            {/* {this.state.active == 'Distrik' &&
                <View style={styles.picker}>
                <Picker
                  selectedValue={this.state.distrik}
                  onValueChange={async  (itemValue, itemIndex) => {
                    await this.setState({...this.state, distrik: itemValue})
                  }}
                  style={styles.pickerChild}  
                  >
                    <Picker.Item label={`Pilih Distrik`} value={0} />
                    {
                      Object.keys(this.state.dataDistrik).map(function(key, index) {
                        let ident = key.split('_')
                        let label = ident.join(' ')
                        let value = ident[1]
                        return(
                          <Picker.Item label={label} value={key} />
                        )
                      })
                      
                    }
                  </Picker>
            </View>
            } */}
            {this.state.active == 'Puskesmas' &&
            <View>
                <BarChart
                    style={styles.diagram}
                    data={{
                        labels: this.state.keyWilayah,
                        datasets: [
                            {
                            data: this.state.jumlahStunting
                            }
                        ]
                    }}
                    width={screenWidth - 40}
                    height={screenWidth / 1.5}
                    yAxisLabel=""
                    chartConfig={chartConfig}
                    verticalLabelRotation={0}
                />
                {this.state.isTableLoad &&
                    <Text>Loading</Text>
                }
                {!this.state.isTableLoad &&
                <ScrollView horizontal style={styles.containerTable}>
                    <Table borderStyle={{borderWidth: 1, borderColor: '#5669ff'}}>
                        <Row data={['Nama Puskesmas', 'Jumlah Anak', 'Jumlah Stunting', 'Prevelensi Stunting' ]} style={styles.headStyle} textStyle={styles.tableText}/>
                        <ScrollView>
                            <Rows data={this.state.dataTablePuskesmas} style={styles.bodyStyle} textStyle={styles.bodyTableText}/>
                        </ScrollView>
                        
                    </Table>
                </ScrollView>
                }
            </View>
            }
            {this.state.active == 'Distrik' &&
            <View>
            <BarChart
                style={styles.diagram}
                data={{
                    labels: this.state.keyDistrik,
                    datasets: [
                        {
                            data: this.state.jumlahStuntingDistrik,
                            color: (opacity = 1) => `rgba(0, 255, 0,${opacity})`,
                          },
                          {
                            data: [8, 6, 7, 4], //this has 50 more items that data array
                            color: (opacity = 1) => `rgba(51, 29, 226,${opacity})`,
                          },
                        
                    ]
                }}
                width={screenWidth - 40}
                height={screenWidth / 1.5}
                yAxisLabel=""
                chartConfig={chartConfig}
                verticalLabelRotation={0}
            />
            {this.state.isTableLoad &&
                    <Text>Loading</Text>
                }
                {!this.state.isTableLoad &&
                <ScrollView horizontal style={styles.containerTable}>
                <Table borderStyle={{borderWidth: 1, borderColor: '#5669ff'}}>
                    <Row data={['Nama Distrik', 'Jumlah Anak', 'Jumlah Stunting', 'Prevelensi Stunting' ]} style={styles.headStyle} textStyle={styles.tableText}/>
                    <ScrollView>
                        <Rows data={this.state.dataTableDistrik} style={styles.bodyStyle} textStyle={styles.bodyTableText}/>
                    </ScrollView>
                    
                </Table>
                </ScrollView>
                }
            
            </View>
            }
            {this.state.active == 'Kampung' &&
            <View>
            <ScrollView
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ flexGrow: 1, height: '100%'}}
            >
                <BarChart
                style={styles.diagram}
                data={{
                    labels: this.state.keyKampung,
                    datasets: [
                        {
                            data: this.state.jumlahStuntingKampung,
                            color: (opacity = 1) => `rgba(0, 255, 0,${opacity})`,
                          },
                          {
                            data: [8, 6, 7, 4], //this has 50 more items that data array
                            color: (opacity = 1) => `rgba(51, 29, 226,${opacity})`,
                          },
                        
                    ]
                }}
                width={130 * this.state.keyKampung.length}
                height={screenWidth / 1.5}
                yAxisLabel=""
                chartConfig={chartConfig}
                verticalLabelRotation={0}
            />
            
            </ScrollView>
            {this.state.isTableLoad &&
                    <Text>Loading</Text>
                }
            {!this.state.isTableLoad &&
                <ScrollView horizontal style={styles.containerTable}>
                        <Table borderStyle={{borderWidth: 1, borderColor: '#5669ff'}}>
                            <Row data={['Nama Kampung', 'Jumlah Anak', 'Jumlah Stunting', 'Prevelensi Stunting' ]} style={styles.headStyle} textStyle={styles.tableText}/>
                            <ScrollView>
                                <Rows data={this.state.dataTableKampung} style={styles.bodyStyle} textStyle={styles.bodyTableText}/>
                            </ScrollView>
                            
                        </Table>
                </ScrollView>
                }
            
            </View>
            }
        </View>
        )
    }
  }
}

const screenWidth = Dimensions.get("window").width;

const chartConfig = {
    backgroundGradientFrom: "#2b3daa",
    backgroundGradientFromOpacity: 0,
    backgroundGradientTo: "#25669f",
    backgroundGradientToOpacity: 1,
    color: (opacity = 1) => `rgba(26, 255, 255, ${opacity})`,
    strokeWidth: 2, // optional, default 3
    barPercentage: 1,
    useShadowColorFromDataset: false // optional
  };

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 20,
    },
    heading1: {
        fontFamily: 'Poppins-Bold',
        color: '#2b3daa',
        fontSize: 25,
        marginTop: 30,
    },
    heading2: {
        fontFamily: 'Poppins-Reg',
        color: '#2b3daa',
        fontSize: 20,
    },
    wrapperButton: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        marginTop: 10,
        marginBottom: 10,
    },
    button: {
        paddingTop: 5,
        paddingBottom: 4,
        paddingHorizontal: 10,
        borderColor: '#5669ff',
        borderWidth: 1,
        borderRadius: 20,
        marginRight: 10,
    },
    textButton: {
      fontFamily: 'Poppins-Reg',
      color: '#5669ff'   
    },
    buttonActive: {
        paddingTop: 5,
        paddingBottom: 4,
        paddingHorizontal: 10,
        backgroundColor: '#5669ff',
        borderWidth: 1,
        borderColor: '#5669ff',
        borderRadius: 20,
        marginRight: 10,
    },
    textButtonActive: {
      fontFamily: 'Poppins-Reg',
      color: '#fff'   
    },
    diagram: {
        backgroundColor: '#5669ff',
        marginTop: 10,
        borderRadius: 10,
    },
    picker: {
        color: '#444',
        backgroundColor: '#fff',
        borderRadius: 7,
        marginTop: 10,
        paddingHorizontal: 7,
      },
      pickerChild: {
        color: '#444'
      },
      wrapperDaftar: {
        flexDirection: 'row',
        marginLeft: 5,
      },
    row: {
        flexDirection: 'row'
    },
    containerTable: {
        borderRadius: 7,
        overflow: 'hidden',
        marginTop: 20,
        height: 200
    },
    headStyle: { 
        height: 50,
        alignContent: "center",
        justifyContent: 'center',
        backgroundColor: '#5669ff',
        width: 500,
      },
      bodyStyle: {
        height: 50,
        borderWidth: 1,
        borderColor: '#5669ff',
        alignContent: "center",
        justifyContent: 'center',
        backgroundColor: '#eee',
        width: 500,
      },
      tableText: { 
        margin: 10,
        textAlign: 'center',
        fontFamily: 'Poppins-Bold',
        color: '#fff',
        fontSize: 13
      },
      bodyTableText: { 
        margin: 10,
        textAlign: 'center',
        fontFamily: 'Poppins-Bold',
        color: '#444',
        fontSize: 13
      }
})
export default PersebaranStunting