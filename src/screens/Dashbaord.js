import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  TouchableHighlight,
  Image,
  Font,
  ImageBackground,
  AsyncStorage,
  AppState,
  // loadAsync,
  Alert,ScrollView,WebView
} from 'react-native';
import { Immersive } from 'react-native-immersive'
import styles from '../assets/style/Stylesheet';
// import Snackbar from 'react-native-snackbar';
import {showSnackBar} from '@prince8verma/react-native-snackbar';
import Snackbar from '@prince8verma/react-native-snackbar';
import Toast from 'react-native-root-toast';
// import Snackbar from 'react-native-snackbar-component';
import WS from 'react-native-websocket'
// import Notification from "./PushNotification"
// import PushNotification from 'react-native-push-notification';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Header from './Header';
import Footer from './Footer';

import Inbox from '../assets/images/inbox.png'



export default class Dashboard extends Component{

    constructor(props) {
        super(props);
        // this.handleAppStateChange = this.handleAppStateChange.bind(this);
        this.state={
           buyingRate:'',
           sellingRate:'',
           timeDepositefor1M:"",
           timeDepositefor5M:"",
           snackIsVisible: false,
           user:"",
           count:'',
           name:'',
           tempArry:[],
           visible:false,
           alert:[],
           showAlert:false, 
           conn:'',
           fixedIncome:""
        }
    }
    _loadInitialState= async() =>{
   
      //  Alert.alert(await AsyncStorage.getItem('user'));
        this.setState({
          user:await AsyncStorage.getItem('user')
        })


        fetch('http://203.190.153.20/primeclient/primeclientApi/Api/get_rates',{
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
       
                userId: this.state.user,
                
              })
          }).then((response) => response.json())
          .then((responseJson) => {
              this.setState( { data: responseJson });
              
              this.setState({ myData: this.state.data['data'] })
            //  console.log(this.state.myData)
              this.setState({
                buyingRate: this.state.myData['us_dollar_peso_rate_ew_buying_1y'],
                sellingRate: this.state.myData['us_dollar_peso_rate_ew_selling_1y'],
                fixedIncome:this.state.myData['fixed_income_rate_t-bills_1y'],
                timeDepositefor5M:this.state.myData['time_deposite_rates_for_5m_1y'],
              })
              // console.log(this.state.buyingRate, this.state.sellingRate, this.state.timeDepositefor1M, this.state.timeDepositefor5M)
       
          }).catch((error) => {
            console.error(error);
          });

          fetch('http://203.190.153.20/primeclient/primeclientApi/Api/get_user_info',{
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
       
                id: this.state.user,
                
              })
          }).then((response) => response.json())
          .then((responseJson) => {
              this.setState( { data: responseJson });
              
              this.setState({ myData: this.state.data['data'] })
            //  console.log(this.state.myData)
              this.setState({
                name: this.state.myData['first_name'],
                
              })
              // console.log(this.state.buyingRate, this.state.sellingRate, this.state.timeDepositefor1M, this.state.timeDepositefor5M)
       
          }).catch((error) => {
            console.error(error);
          });


          fetch('http://203.190.153.20/primeclient/primeclientApi/Api/get_time_deposit_rate',{
              method: 'POST',
              headers: {
                  Accept: 'application/json',
                  'Content-Type': 'application/json'
                },
          
            }).then((response) => response.json())
            .then((responseJson) => {
                this.setState( { data: responseJson });
                
                this.setState({ myData: this.state.data['data'] })
                console.log(this.state.data['data'])
               var count = Object.keys(this.state.data['data']).length;
               console.log(count)
                // console.log( this.state.data['data'])
                var allArray=[]
                var valueArry=[]
                for(let i=0;i<count; ++i){
                    // console.log(this.state.myData[i])
                    var newdata= this.state.myData[i]
                    var time= newdata['time']
                    var rate= newdata['rate']
                    var newtime= time.split(',')
                    var newrate= rate.split(',')
                   
                    var for_1year= newrate[0]
                    var for_5year= newrate[1]
                    allArray.push({title:newdata['ammount_range'], for_1year:for_1year, for_5year:for_5year})
                   var newArray=[]
                  //  console.log(allArray)
   
                }
              
                this.setState({
                    tempArry:allArray
                })
               
            }).catch((error) => {
              console.error(error);
            });

            this.get_notification() 
      }

    componentDidMount=()=>{
  
        this._loadInitialState().done();
        this.conn = new WebSocket('ws://203.190.153.20:2021/phpsocket/php-socket.php')
        if(this.conn){
          console.log("hello")
        }
        this.setState({
          conn:this.conn
        })

        Immersive.on()
Immersive.setImmersive(true)

       
        // AppState.addEventListener("change", this.handleAppStateChange);
      
    }


 

    get_notification=()=>{
     console.log(this.state.user)

      fetch('http://203.190.153.20/primeclient/primeclientApi/Api/unread_notifications',{
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
       
                id: this.state.user,
                
              })
          }).then((response) => response.json())
          .then((responseJson) => {
              this.setState( { newdata: responseJson });
              console.log(this.state.newdata)
              
              // console.log(this.state.notification)
              // console.log( counti)
              if(this.state.newdata['status']=="1"){

                this.setState({ notification: this.state.newdata['data'] })
                this.setState({alert:this.state.notification})
              var counti = Object.keys(this.state.notification).length;
              this.setState({
                count:counti,
                status:this.state.newdata['status']
              })
              
              let toast= Toast.show("You have recieved "+counti+" Notification", {
                duration: Toast.durations.LONG,
                position: Toast.positions.TOP,
                shadow: true,
                animation: true,
                hideOnPress: true,
                delay: 0,
                
                onHide: () => {
                  fetch('http://203.190.153.20/primeclient/primeclientApi/Api/check_balance',{
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json'
                      },
                      body: JSON.stringify({
               
                        id: this.state.user,
                        
                      })
                  }).then((response) => response.json())
                  .then((responseJson) => {
                      this.setState( { data: responseJson });
                       console.log(this.state.data)
                      if(this.state.data['status']==1){
                         this.setState({
                            balanceData:this.state.data['data']
                         })
                         if(this.state.balanceData['status']==0){
                          setTimeout(() => this.setState({
                            visible: true,
                            showAlert:true
                        }), 2000);
                         }
                      }
                      
                      
                  }).catch((error) => {
                    console.error(error);
                  }); 

                  setTimeout(() => this.setState({
                    // visible: true,
                    showAlert:true
                }), 2000);
                },
                onHidden: () => {
                    // calls on toast\`s hide animation end.
                }
            });

            setTimeout(function () {
              Toast.hide(toast);
          }, 5000);
              }
              else{
                fetch('http://203.190.153.20/primeclient/primeclientApi/Api/check_balance',{
                  method: 'POST',
                  headers: {
                      Accept: 'application/json',
                      'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
             
                      id: this.state.user,
                      
                    })
                }).then((response) => response.json())
                .then((responseJson) => {
                    this.setState( { data: responseJson });
                     console.log(this.state.data)
                    if(this.state.data['status']==1){
                       this.setState({
                          balanceData:this.state.data['data']
                       })
                       console.log(this.state.balanceData)
                       if(this.state.balanceData['status']==0){
                        setTimeout(() => this.setState({
                          visible: true,
                          
                      }), 2000);
                       }
                    }
                    
                    
                }).catch((error) => {
                  console.error(error);
                }); 
              }
              var counti= 
             console.log(this.state.notification)
              
          }).catch((error) => {
            console.error(error);
          });

        
    }

    readBalance=()=>{
      console.log(JSON.stringify({
   
        id: this.state.user,
        
      }))
      fetch('http://203.190.153.20/primeclient/primeclientApi/Api/read_check_balance',{
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
   
            id: this.state.user,
            
          })
      }).then((response) => response.json())
      .then((responseJson) => {
          this.setState( { data: responseJson });

          
          
      }).catch((error) => {
        console.error(error);
      });
    }

    balanceRequest=()=>{
     
      fetch('http://203.190.153.20/primeclient/primeclientApi/Api/request_balance',{
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
   
            id: this.state.user,
            
          })
      }).then((response) => response.json())
      .then((responseJson) => {
          this.setState( { data: responseJson });

          if(this.state.data['status']==1){
            this.props.navigation.navigate("BalanceRequest");
          }
          else{
            Alert.alert(this.state.data['message'])
          }
          
      }).catch((error) => {
        console.error(error);
      });

    }
   
    // componentWillReceiveProps(){

    // }

   
    render(){
      //  console.log(this.state.alert)
       this.state.conn.onmessage =(event)=>{
        var message= JSON.parse(event.data)
        console.log(message)
        if(message==null){
          console.log("hello")
        }
        else{
          if(message['status']=="1"){
            var row_data= message['data']
            // console.log(row_data)
            if(message["type"]=="time_deposit_rate"){
              var count = Object.keys(row_data).length;
              console.log(count)
               // console.log( this.state.data['data'])
               var allArray=[]
               var valueArry=[]
               for(let i=0; i<count; i++){
                 
                // console.log(i)
                var newdata= row_data[i]
                // console.log(newdata)
                var time= newdata['time']
                var rate= newdata['rate']
                var newtime= time.split(',')
                var newrate= rate.split(',')
               
                var for_1year= newrate[0]
                var for_5year= newrate[1]
                allArray.push({title:newdata['ammount_range'], for_1year:for_1year, for_5year:for_5year})
               var newArray=[]
               console.log(allArray)
               }
             
               this.setState({
                   tempArry:allArray
               })
            }
            else if(message["type"]=="salart"){
              console.log(row_data)
              var counti = Object.keys(row_data).length;
              this.setState({alert:row_data,
                showAlert:true})
              console.log("hello")
              console.log(this.state.alert)
              
                
            }
            else if(message["type"]=="rate_update"){
               this.setState({
              buyingRate: row_data['us_dollar_peso_rate_ew_buying_1y'],
                  sellingRate: row_data['us_dollar_peso_rate_ew_selling_1y'],
                  fixedIncome:row_data['fixed_income_rate_t-bills_1y'],
                  // timeDepositefor5M:this.state.myData['time_deposite_rates_for_5m_1y'],
            })
            }
            
            
          }
          else{
            console.log("hello")
          }
        }
       
        // const type= row_data["types"]
        
        // console.log(message)
      }
       
        return(
           <View style={{width:"100%", height:"100%"}}>
           
               <ScrollView>
                 <View style={styles.container}>
                <View style={[styles.newConatiner,{backgroundColor:"#fff"}]}>
               <View>
               <Header Name={this.state.name} /> 
               </View>
                 <View style={{width:'100%', height:"100%", alignItems:"center", marginTop:0,
                  padding: 20, paddingTop:0 }}>
                   <View style={styles.TextContainer}>
                        <Text style={styles.titleText}>U.S. Dollar Peso Rate</Text>
                        <Text style={[styles.titleText,{fontSize:15}]}>($10,000 and above)</Text>
                        <View style={{width:"100%", flexDirection:'row', justifyContent:'space-between',
                         padding:5}}>
                             <Text style={{ fontSize:15, fontFamily:"Raleway-Bold"}}>EW is Buying $ at</Text>
                             <Text style={{color:"#f00", fontSize:16}}>₱ {this.state.buyingRate}</Text>
                        </View>
                        <View style={{width:"100%", flexDirection:'row', justifyContent:'space-between',
                         padding:5}}>
                             <Text style={{ fontSize:15, fontFamily:"Raleway-Bold"}}>EW is Selling $ at</Text>
                             <Text style={{color:"#f00", fontSize:16}}>₱ {this.state.sellingRate} </Text>
                        </View>
                   </View>
                   <View style={styles.TextContainer}>
                        <Text style={styles.titleText}>Time Deposite Rates</Text>
                        
                    
                       { this.state.tempArry.map((value, index)=>{
                                    return(
                                      <View key={index}>
                                      <Text style={[styles.titleText,{fontSize:16}]}>(₱ {value.title})</Text>
                                  <View style={{width:"100%", flexDirection:'row', justifyContent:'space-between',
                                   padding:5}}>
                                       <Text style={{ fontSize:16,fontFamily:"Raleway-Bold"}}>1 Year</Text>
                                       <Text style={{color:"#f00", fontSize:17}}>{value.for_1year}%</Text>
                                  </View>
                                  <View style={{width:"100%", flexDirection:'row',fontFamily:"Raleway-Bold",  justifyContent:'space-between',
                                   padding:5}}>
                                       <Text style={{ fontSize:16, fontFamily:"Raleway-Bold"}}>5 Year</Text>
                                       <Text style={{color:"#f00", fontSize:16}}>{value.for_5year}%</Text>
                                  </View>
                                   </View>
                                      )
                                 } 
                                 )
                        }

                        {/* <Text style={[styles.titleText,{fontSize:17}]}>(₱ 5M and above)</Text>
                        <View style={{width:"100%", flexDirection:'row', justifyContent:'space-between',
                         padding:10}}>
                             <Text style={{ fontSize:17}}>1 Year</Text>
                             <Text style={{color:"#f00", fontSize:17}}>{this.state.timeDepositefor5M}%</Text>
                        </View> */}
                   </View>
                   <View style={[styles.TextContainer,{marginBottom:20}]}>
                        <Text style={styles.titleText}>Fixed Income Rate</Text>
                        {/* <Text style={[styles.titleText,{fontSize:17}]}>($10,000 and above)</Text> */}
                        <View style={{width:"100%", flexDirection:'row', justifyContent:'space-between',
                         padding:5}}>
                             <Text style={{ fontSize:16, fontFamily:"Raleway-Bold"}}>T-bills</Text>
                             <Text style={{ fontSize:16, fontFamily:"Raleway-Bold"}}>1 Year</Text>
                             <Text style={{color:"#f00", fontSize:17}}>{this.state.fixedIncome}</Text>
                        </View>
                        
                   </View>
                   <View style={[styles.TextContainer,{paddingLeft:20, paddingRight:20}]}>
                        <Text style={[styles.titleText,{fontSize:20, fontFamily:"Raleway-Bold"}]}>What do you want to do?</Text>
                        {/* <Text style={[styles.titleText,{fontSize:17}]}>($10,000 and above)</Text> */}
                        <View style={{width:"100%",
                         padding:20, paddingTop:0, paddingBottom:10}}>
                             <TouchableOpacity
                                onPress={() => {
                                    this.props.navigation.navigate("BuyDollars",{name:this.state.name});
                                  }}>
                                 <Text style={{textDecorationLine:"underline", textAlign:"center", fontFamily:"Raleway-Bold", marginBottom:12}}>BUY DOLLARS</Text>
                             </TouchableOpacity>
                             <TouchableOpacity
                              onPress={() => {
                                this.props.navigation.navigate("SellDollar",{name:this.state.name});
                              }}>
                                 <Text style={{textDecorationLine:"underline", textAlign:"center" ,fontFamily:"Raleway-Bold", marginBottom:12}}>SELL DOLLARS</Text>
                             </TouchableOpacity>
                             <TouchableOpacity
                               onPress={() => {
                                this.props.navigation.navigate("TimeDeposit",{name:this.state.name});
                              }}>
                                 <Text style={{textDecorationLine:"underline", textAlign:"center" ,fontFamily:"Raleway-Bold", marginBottom:12}}>TIME DEPOSIT</Text>
                             </TouchableOpacity>
                             <TouchableOpacity
                               onPress={() => {
                                this.props.navigation.navigate("FixedIncome",{name:this.state.name});
                              }}>
                                 <Text style={{textDecorationLine:"underline",fontFamily:"Raleway-Bold", textAlign:"center", marginBottom:5}}>FIXED INCOME</Text>
                             </TouchableOpacity>
                             
                        </View>
                        
                        <TouchableOpacity
                         onPress={this.balanceRequest}>
                        <Text style={{textDecorationLine:"underline", fontFamily:"Raleway-Bold", textAlign:"center", marginBottom:60, marginTop:5}}>
                        What are my Bank Balances?</Text>
                        </TouchableOpacity>

                   </View>

                    
                </View>
                
            </View>
        </View>
           </ScrollView>
           <Footer UserId={this.state.user} Status={this.state.status} Page="Home" /> 
            <Snackbar id={"root_app"}/>
           <View style={{position:"absolute", top:0, width:"100%"}}> 
           {/* <Toast
        style={{width:"100%", padding:10}}
            visible={this.state.visible}
            position={10}
            shadow={false}
            width={400}
            animation={false}
            opacity={1}
            backgroundColor="#2D9731"
            hideOnPress={true}
            onHide={()=>this.readBalance()}
        >
          <Text style={{fontWeight:"bold", width:"100%"}}>
            <Text style={{textAlign:"left"}}>EWFX Prime Balances:</Text>{"\n"}
           Your Account Balances Are{"\n"}
          Peso Account: ₱ 5,230,000.00{"\n"}
            Dollar Account: $ 226,030.00</Text>
        </Toast> */}
        {

this.state.alert.map((value, index)=>{
    return(
      <View style={{marginBottom:10}}>
        
        {
            value.type=="ALERT"&&value.status=="0"?<Toast
            style={{width:"100%", padding:10}}
                visible={this.state.showAlert}
                position={10}
                shadow={false}
                width={400}
                animation={false}
                opacity={1}
                backgroundColor="#2D9731"
                hideOnPress={true}
                onHide={()=>this.readBalance()}
            >
              <Text style={{fontWeight:"bold", width:"100%"}}>
                {value.notification}
                </Text>
            </Toast>:null
        }
       
     
      </View>  
    )
} 
)

}
{/* <Notification/> */}
           </View>
            
           </View>
        );
    }
}