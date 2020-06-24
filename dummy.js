$(document).ready(function() {
  SP.SOD.executeFunc('sp.js', 'SP.ClientContext', function() {
    init()
  })
})

function init() {
  $('#btnUploadFiles').click(function() {
    var files = $('#inputTypeFiles')[0].files
    uploadFiles(files[0]) // uploading singe file
  })
}

function uploadFiles(uploadFileObj) {
  var fileName = uploadFileObj.name
  var webUrl = _spPageContextInfo.webAbsoluteUrl
  var documentLibrary = 'SampleDocuments'
  var folderName = 'Folder1'
  var targetUrl = _spPageContextInfo.webServerRelativeUrl + '/' + documentLibrary + '/' + folderName
  var url = webUrl + "/_api/Web/GetFolderByServerRelativeUrl(@target)/Files/add(overwrite=true, url='" + fileName + "')?$expand=ListItemAllFields&amp;amp;@target='" + targetUrl + "'"

  uploadFileToFolder(
    uploadFileObj,
    url,
    function(data) {
      var file = data.d
      var updateObject = {
        __metadata: {
          type: file.ListItemAllFields.__metadata.type
        },
        Column1: 'Test Data', //meta data column1
        Column2: 'Test Data' //meta data column2
      }

      url = webUrl + "/_api/Web/lists/getbytitle('" + documentLibrary + "')/items(" + file.ListItemAllFields.Id + ')'

      updateFileMetadata(
        url,
        updateObject,
        file,
        function(data) {
          alert('File uploaded &amp;amp; meta data updation done successfully')
        },
        function(data) {
          alert('File upload done but meta data updating FAILED')
        }
      )
    },
    function(data) {
      alert('File uploading and meta data updating FAILED')
    }
  )
}

function getFileBuffer(uploadFile) {
  var deferred = jQuery.Deferred()
  var reader = new FileReader()
  reader.onloadend = function(e) {
    deferred.resolve(e.target.result)
  }
  reader.onerror = function(e) {
    deferred.reject(e.target.error)
  }
  reader.readAsArrayBuffer(uploadFile)
  return deferred.promise()
}

function uploadFileToFolder(fileObj, url, success, failure) {
  var apiUrl = url
  var getFile = getFileBuffer(fileObj)
  getFile.done(function(arrayBuffer) {
    $.ajax({
      url: apiUrl,
      type: 'POST',
      data: arrayBuffer,
      processData: false,
      async: false,
      headers: {
        accept: 'application/json;odata=verbose',
        'X-RequestDigest': jQuery('#__REQUESTDIGEST').val()
      },
      success: function(data) {
        success(data)
      },
      error: function(data) {
        failure(data)
      }
    })
  })
}

function updateFileMetadata(apiUrl, updateObject, file, success, failure) {
  $.ajax({
    url: apiUrl,
    type: 'POST',
    async: false,
    data: JSON.stringify(updateObject),
    headers: {
      accept: 'application/json;odata=verbose',
      'X-RequestDigest': $('#__REQUESTDIGEST').val(),
      'Content-Type': 'application/json;odata=verbose',
      'X-Http-Method': 'MERGE',
      'IF-MATCH': file.ListItemAllFields.__metadata.etag
    },
    success: function(data) {
      success(data)
    },
    error: function(data) {
      failure(data)
    }
  })
}
