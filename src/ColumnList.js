import React, { useState, useEffect, setState } from 'react';
function ColumnList(props){
    const {
        worksheet,
        updateSearch,
    } = props
    const [selectedColumns, setSelectedColumns] = useState('')
    const [selectedFilters, setselectedFilters] = useState('')

    function toggleColumn(col){
        if (selectedColumns.includes(col)){
            setSelectedColumns(selectedColumns.filter((e)=>(e !== col)),updateSearch)
        }else{
            setSelectedColumns([...selectedColumns, col], updateSearch)
        }
        
    }
    function toggleFilter(filter){
        console.log(filter,"filter!!")
        if (selectedColumns.includes(filter)){
            setselectedFilters(selectedFilters.filter((e)=>(e !== filter)),updateSearch)
        }else{
            setselectedFilters([...selectedFilters, filter], updateSearch)
        }
    }
    const [columns,setColumns] = useState('')
    useEffect(() => {
        updateSearch(selectedColumns,selectedFilters)
    }, [selectedColumns]);
    useEffect(() => {
        updateSearch(selectedColumns,selectedFilters)
    }, [selectedFilters]);
    useEffect(() => {
        getWorksheet()
    }, [])
    function getWorksheet(restURLParams){
        let formData = 'export_ids=%5B'+worksheet+'%5D&formattype=JSON&export_associated=false'
        let url = 'https://se-thoughtspot-cloud.thoughtspot.cloud/callosum/v1/tspublic/v1/metadata/tml/export'
        fetch(url,
        {
          headers: {
            'Accept': 'text/plain',
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          method:'POST',
          credentials: 'include',
          body: formData
        })
        .then(response => response.text()).then(
          data => {
              var fileinfo = JSON.parse(data)
              var tml = JSON.parse(fileinfo.object[0].edoc)
              setColumns(tml.worksheet.worksheet_columns)
        })
      }
      var tables = {}
      for (var col of columns){
        var table = col.column_id ? col.column_id.split("::")[0] : 'FORMULAS'
        tables[table] ? tables[table].push(col.name) : tables[table] = [col.name]
      }

      var menu = []
      for (var tableName of Object.keys(tables)){
        var colOptions = []
        for (var col of tables[tableName]){
            colOptions.push(
                <Column worksheet={worksheet} col={col} toggleColumn={toggleColumn} toggleFilter={toggleFilter} isSelected={selectedColumns && selectedColumns.includes(col)}></Column>
            )
        }
        menu.push(<div style={{display:'flex',flexDirection:'column',alignItems:'flex-start', height:'150px',padding:'10px'}}>
            <div style={{fontWeight:600,display:'flex',justifyContent:'center',alignItems:'center',width:'100%',marginBottom:'5px'}}>
                {tableName.replace("_1","").replace("_"," ")}
            </div>
            <div style={{display:'flex',width:'150px',flexDirection:'column',alignItems:'flex-start',overflow:'auto',scrollbarWidth:'thin'}}>
            {colOptions}
            </div>
            </div>)
      }
      return (
        <div style={{display:'flex',boxShadow:'0px 0px 15px #e6e6e6',padding:'10px',marginLeft:'15px',marginRight:'15px',marginTop:'15px',flexDirection:'row'}}>
            {menu}
        </div>
      )
}
export default ColumnList

function Column(props){
    const {
        worksheet,
        col,
        isSelected,
        toggleColumn,
        toggleFilter
    } = props
    const [filterListVisible, setFilterListVisible] = useState('')
    function toggleColumnSelector(){
        toggleColumn(col)
    }
    function toggleFilterSelection(){
        setFilterListVisible(!filterListVisible)
    }
    return(
        <div style={{fontSize:'11px', wordWrap:'none',display:'flex',flexDirection:'row',minHeight:'25px',borderBottom:'1px solid #efefef',alignItems:'center'}} >
        <div  onClick={toggleColumnSelector} style={{marginRight:'5px',minHeight:'15px',width:'15px',borderRadius:'5px',background:isSelected?'#276fef':'#efefef'}}>
        </div>
        <div  onClick={toggleFilterSelection} style={{marginRight:'5px',minHeight:'15px',width:'15px',borderRadius:'5px',border:'1px solid #cccccc'}}>
        f</div>
        <div> {col}</div>
        {filterListVisible?
            <div>
                <div onClick={toggleFilterSelection} style={{zIndex:998,position:'fixed',top:0,left:0,width:'100vh',height:'100vh'}}>
                </div>
                <FilterPopup worksheet={worksheet} col={col} toggleFilter={toggleFilter}></FilterPopup>
            </div>
        :null}
        </div>
        
    )
}

function FilterPopup(props){
    const {
        worksheet,
        col,
        toggleFilter
    } = props
    
    const [filterValues, setFilterValues] = useState('')

    useEffect(() => {
        var queryString = '['+col+']'
        if (queryString){
            var url = "https://se-thoughtspot-cloud.thoughtspot.cloud/callosum/v1/tspublic/v1/searchdata?query_string="+encodeURIComponent(queryString)+
            "&data_source_guid="+worksheet+"&batchsize=-1&pagenumber=-1&offset=-1&formattype=COMPACT"
            fetch(url,
            {
                headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
                },
                method:'POST',
                credentials: 'include',
            })
            .then(response => response.json()).then(
                data => {
                    setFilterValues(data.data)
            })
        }
    },[])
    var filterOptions = []
    for (var i=0;i<filterValues.length;i++){
        var val = filterValues[i][0];
        filterOptions.push(<Filter value={val} toggleFilter={toggleFilter}></Filter>)
    }
    return(
        <div style={{boxShadow:'0px 0px 25px #e0e0e0', zIndex:999,display:'flex',flexDirection:'column',position:'absolute',background:'#ffffff',padding:'10px'}}>
            {filterOptions}
        </div>


    )
}
function Filter(props){
    const {
        value,
        toggleFilter
    } = props
    function toggleFilterValue(){
        toggleFilter(value)
    }
    return (
        <div className="filterPicker" 
            onClick={toggleFilterValue}
            style={{height:'20px',
            padding:'5px',
            marginBottom:'5px',
            display:'flex',
            alignItems:'flex-start'}}>
            {value}
        </div>
    )
}