let query = {
    getURLSearchParam: function (paramString, paramName) {
        return (paramString.includes(paramName)
            ?
            paramString.split(`${paramName}=`)[1].split("&")[0]
            :
            null)
    },

    removeURLSearchParam: function(paramString, paramName) {
    return (paramString.includes(paramName)
        ?
        "?".concat(
            paramString.slice(1).split("&").map(str => str.split("=")).filter(arr => arr[0] != paramName).map((arr) => arr.join("=")).filter((el) => el != "").join("&")
        )
        :
        paramString)
    }
}



export default query