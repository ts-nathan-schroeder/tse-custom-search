import React, { useState, useEffect, setState } from 'react';
import { init,  AuthType, Page, EmbedEvent, Action, HostEvent} from '@thoughtspot/visual-embed-sdk';
import { SearchEmbed, LiveboardEmbed, AppEmbed, useEmbedRef } from '@thoughtspot/visual-embed-sdk/react';
import ColumnList from './ColumnList';
import DataObjView from './DataObjView'
function Tenable(props){
    const{
        worksheet
    } = props
    const embedRef = useEmbedRef();
    const [dataObj,setDataObj] = useState('')

    function onEmbedRendered(){
        embedRef.current.on(EmbedEvent.QueryChanged,(resp) => {
            console.log("data!",resp)
            // const event = new CustomEvent('popup', {detail: {data: resp.data.search}});
            // window.dispatchEvent(event)
        })
    }
    function updateSearch(selectedColumns,selectedFilters){
        var searchString =""
        for (var i in selectedColumns){
            searchString += "["+selectedColumns[i]+"] "
        }
        for (var i in selectedFilters){
            searchString += "'"+selectedFilters[i]+"' "

        }
        if (embedRef.current){
            embedRef.current.trigger(HostEvent.Search, {
                searchQuery: searchString,
                dataSources: []
            });
            
            // embedRef.current.trigger(HostEvent.Filter, {
            //     searchQuery: searchString,
            //     executeSearch: true,
            // });
        }
        const event = new CustomEvent('popup', {detail: {data: searchString}});
        window.dispatchEvent(event)
    }
    return(
        <div style={{display:'flex',flexDirection:'column'}}>
            <div className="sectionTitle">2. REST API - Worksheet TML </div>
            <div style={{flex:1}}>
                <ColumnList key={worksheet} worksheet={worksheet} updateSearch={updateSearch} ></ColumnList>
            </div>     
            <SearchString></SearchString>   
            <div className="sectionTitle">4a. Visual Embed SDK</div>  
            <div style={{
                display:'flex',
                flex:2,
                minHeight:'600px',
                width:'calc(100vw - 30px)',
                boxShadow:'0px 0px 15px #e0e0e0',
                marginTop:'15px',
                marginRight:'15px',
                marginLeft:'15px',
            }}>
                <SearchEmbed ref={embedRef} onLoad={onEmbedRendered} dataSources={[worksheet]} hideDataSources={true} frameParams={{width:'calc(100vw - 30px)',height:'100%'}}></SearchEmbed>
            </div>
            <div className="sectionTitle">4b. REST API - Search</div>  
            <div style={{flex:1}}>
                <DataObjView worksheet={worksheet}></DataObjView>
            </div>
        </div>
    )
}
export default Tenable;
function SearchString(){
    const [queryString,setQueryString] = useState('')
    useEffect(() => {
        window.addEventListener('popup', function(e){
            setQueryString(e.detail.data)
        })

    },[])

    return (
        <div style={{display:'flex',flexDirection:'column',alignItems:'flex-start',fontSize:'16px',fontWeight:600}}>
            <div className="sectionTitle">3. Generate Query String</div>
            <div style={{marginLeft:'30px',marginTop:'10px',fontWeight:300}}>
            Query: {queryString}
            </div>
        </div>
    )
}

