var errorcontainer = 'ErrorContainer';

(function () {
  if (typeof SPClientTemplates === 'undefined') return
  var AlertsCTX = {}
  AlertsCTX.Templates = {}
  AlertsCTX.Templates.Fields = {
    'MissionCategory': {
      'View': ACView,
      'DisplayForm': ACDisplay,
      'EditForm': ACEdit,
      'NewForm': ACNew
    }
  }
  SPClientTemplates.TemplateManager.RegisterTemplateOverrides(AlertsCTX)
})()

function RegisterCallBacks(formCtx) {
  formCtx.registerInitCallback(formCtx.fieldName, function () {
    var catInput = document.getElementById('AlertCatSelect')
  })

  formCtx.registerGetValueCallback(formCtx.fieldName, function () {
    var dd = document.getElementById('AlertCatSelect')
    var selectedval = dd.options[dd.selectedIndex].value
    return selectedval
  })

  var validators = new SPClientForms.ClientValidation.ValidatorSet()

  if (formCtx.fieldSchema.Required) {
    validators.RegisterValidator(new SPClientForms.ClientValidation.RequiredValidator())
  }

  if (validators._registeredValidators.length > 0) {
    formCtx.registerClientValidator(formCtx.fieldName, validators)
  }

  formCtx.registerValidationErrorCallback(formCtx.fieldName, function (errorResult) {
    SPFormControl_AppendValidationErrorMessage(errorcontainer, errorResult)
  })
}

function ACEdit (ctx) {
  if (ctx == null || ctx.CurrentFieldValue == null) return ''
  var formCtx = SPClientTemplates.Utility.GetFormContextForCurrentField(ctx)
  if (formCtx == null || formCtx.fieldSchema == null) return ''
  RegisterCallBacks(formCtx)
  return RenderExistingValues(ctx)
}

function ACNew (ctx) {
  if (ctx == null || ctx.CurrentFieldValue == null) return ''
  var formCtx = SPClientTemplates.Utility.GetFormContextForCurrentField(ctx)
  if (formCtx == null || formCtx.fieldSchema == null) return ''
  RegisterCallBacks(formCtx)
  var html = '<table><tr><td width=\'500\'><select id=\'AlertCatSelect\' onchange=\'changeme(this);\'><option selected value=\'Default\'>Default: Blue Color Alert - Standard</option>'
  html += '<option value=\'Alert\'>Alert: Yellow Color Alert - Traffic, etc</option>'
  html += '<option value=\'Poll\'>Alert: Green Color Alert - Polls/Surveys</option>'
  html += '<option value=\'Urgent\'>Alert: Red Color Alert - Urgent Messages</option>'
  html += '<option value=\'Crisis\'>Alert: Red Color Alert - Crisis Only</option>'
  html += '</select></td></tr><tr><td id=\'selectedAlert\'>'
  html += '<div class=\'alert alert-info alert-lg\' style=\'width: 500px;\'><strong>DEFAULT NOTICE:</strong> '
  html += 'This is an example'
  html += '<a class=\'btn btn-info btn-lg\' href=\'#\'>Button Text</a></div>'
  html += '</td></tr>'
  html += '<tr><td id=\'' + errorcontainer + '\' width=\'500\'></td></tr></table>'
  return html
}

function RenderExistingValues (ctx) {
  var selectedval = ctx.CurrentItem[ctx.CurrentFieldSchema.Name];
  var html = '<table><tr><td width=\'500\'><select id=\'AlertCatSelect\' onchange=\'changeme(this);\'>';
  switch (selectedval) {
    case 'Crisis':
      html += '<option value=\'Default\'>Default: Blue Color Alert - Standard</option>'
      html += '<option value=\'Alert\'>Alert: Yellow Color Alert - Traffic, etc</option>'
      html += '<option value=\'Poll\'>Alert: Green Color Alert - Polls/Surveys</option>'
      html += '<option value=\'Urgent\'>Alert: Red Color Alert - Urgent Messages</option>'
      html += '<option selected value=\'Crisis\'>Alert: Red Color Alert - Crisis Only</option>'
      html += '</select></td></tr><tr><td id=\'selectedAlert\'>';
      html += '<div class=\'alert alert-crisis-homepage\'><div class=\'alert-crisis-homepage-wrapper\'><p class=\'alert-crisis-homepage-header\'><strong>'
      html += 'Example Crisis'
      html += '</strong></p><p class=\'alert-crisis-homepage-content\'>'
      html += 'This is an example'
      html += '   Last Modified: ' + dateformat(new Date(), 'modified')
      html += '</p><p class=\'alert-crisis-homepage-buttons\'>'
      html += '<a class=\'btn btn-crisis-public\' href=\'#\'>Latest Public Statements</a>'
      html += '<a class=\'btn btn-crisis-employee\' href=\'#\'>Employee Information</a></p></div></div>'
      html += '</td></tr>'
      html += '<tr><td id=\'' + errorcontainer + '\' width=\'500\'></td></tr></table>'
      break

    case 'Default':
      html += '<option selected value=\'Default\'>Default: Blue Color Alert - Standard</option>'
      html += '<option value=\'Alert\'>Alert: Yellow Color Alert - Traffic, etc</option>'
      html += '<option value=\'Poll\'>Alert: Green Color Alert - Polls/Surveys</option>'
      html += '<option value=\'Urgent\'>Alert: Red Color Alert - Urgent Messages</option>'
      html += '<option value=\'Crisis\'>Alert: Red Color Alert - Crisis Only</option>'
      html += '</select></td></tr><tr><td id=\'selectedAlert\'>'
      html += '<div class=\'alert alert-info alert-lg\' style=\'width: 500px\'><strong>DEFAULT NOTICE:</strong> '
      html += 'This is an example'
      html += '<a class=\'btn btn-info btn-lg\' href=\'#\'>Button Text</a></div>'
      html += '</td></tr>'
      html += '<tr><td id=\'' + errorcontainer + '\' width=\'500\'></td></tr></table>'
      break

    case 'Alert':
      html += '<option value=\'Default\'>Default: Blue Color Alert - Standard</option>'
      html += '<option selected value=\'Alert\'>Alert: Yellow Color Alert - Traffic, etc</option>'
      html += '<option value=\'Poll\'>Alert: Green Color Alert - Polls/Surveys</option>'
      html += '<option value=\'Urgent\'>Alert: Red Color Alert - Urgent Messages</option>'
      html += '<option value=\'Crisis\'>Alert: Red Color Alert - Crisis Only</option>'
      html += '</select></td></tr><tr><td id=\'selectedAlert\'>'
      html += '<div class=\'alert alert-warning alert-lg\' style=\'width: 500px\'><strong>ALERT:</strong> '
      html += 'This is an example'
      html += '<a class=\'btn btn-warning btn-lg\' href=\'#\'>Button Text</a></div>'
      html += '</td></tr>'
      html += '<tr><td id=\'' + errorcontainer + '\' width=\'500\'></td></tr></table>'
      break

    case 'Poll':
      html += '<option value=\'Default\'>Default: Blue Color Alert - Standard</option>'
      html += '<option value=\'Alert\'>Alert: Yellow Color Alert - Traffic, etc</option>'
      html += '<option selected value=\'Poll\'>Alert: Green Color Alert - Polls/Surveys</option>'
      html += '<option value=\'Urgent\'>Alert: Red Color Alert - Urgent Messages</option>'
      html += '<option value=\'Crisis\'>Alert: Red Color Alert - Crisis Only</option>'
      html += '</select></td></tr><tr><td id=\'selectedAlert\'>'
      html += '<div class=\'alert alert-success alert-lg\' style=\'width: 500px\'><strong>POLL/SURVEY:</strong> '
      html += 'This is an example'
      html += '<a class=\'btn btn-success btn-lg\' href=\'#\'>Button Text</a></div>'
      html += '</td></tr>'
      html += '<tr><td id=\'' + errorcontainer + '\' width=\'500\'></td></tr></table>'
      break

    case 'Urgent':
      html += '<option value=\'Default\'>Default: Blue Color Alert - Standard</option>'
      html += '<option value=\'Alert\'>Alert: Yellow Color Alert - Traffic, etc</option>'
      html += '<option value=\'Poll\'>Alert: Green Color Alert - Polls/Surveys</option>'
      html += '<option selected value=\'Urgent\'>Alert: Red Color Alert - Urgent Messages</option>'
      html += '<option value=\'Crisis\'>Alert: Red Color Alert - Crisis Only</option>'
      html += '</select></td></tr><tr><td id=\'selectedAlert\'>'
      html += '<div class=\'alert alert-danger alert-lg\' style=\'width: 500px\'><strong>URGENT ALERT:</strong> '
      html += 'This is an example'
      html += '<a class=\'btn btn-danger btn-lg\' href=\'#\'>Button Text</a></div>'
      html += '</td></tr>'
      html += '<tr><td id=\'' + errorcontainer + '\' width=\'500\'></td></tr></table>'
      break
  }
  return html
}

function ACView (ctx) {
  if (ctx != null && ctx.CurrentItem != null) {
    return ctx.CurrentItem[ctx.CurrentFieldSchema.Name]
  }
  else {
    return 'No value stored'
  }
}

function ACDisplay (ctx) {
  if (ctx != null && ctx.CurrentItem != null) { return ctx.CurrentItem[ctx.CurrentFieldSchema.Name] }
  else {
    return 'No value stored'
  }
}

function changeme (obj) {
  var dd = document.getElementById(obj.id)
  var selectedval = dd.options[dd.selectedIndex].value
  var html = ''
  switch (selectedval) {
    case 'Crisis':
      html += '<div class=\'alert alert-crisis-homepage\'><div class=\'alert-crisis-homepage-wrapper\'><p class=\'alert-crisis-homepage-header\'><strong>'
      html += 'Example Crisis'
      html += '</strong></p><p class=\'alert-crisis-homepage-content\'>'
      html += 'This is an example'
      html += '   Last Modified: ' + new Date().toDateString()
      html += '</p><p class=\'alert-crisis-homepage-buttons\'>'
      html += '<a class=\'btn btn-crisis-public\' href=\'#\'>Latest Public Statements</a>'
      html += '<a class\'btn btn-crisis-employee\' href=\'#\'>Employee Information</a></p></div></div>'
      break

    case 'Default':
      html += '<div class=\'alert alert-info alert-lg\' style=\'width: 500px\'><strong>DEFAULT NOTICE:</strong> '
      html += 'This is an example'
      html += '<a class=\'btn btn-info btn-lg\' href=\'#\'>Button Text</a></div>'
      break

    case 'Alert':
      html += '<div class=\'alert alert-warning alert-lg\' style=\'width: 500px\'><strong>ALERT:</strong> '
      html += 'This is an example'
      html += '<a class=\'btn btn-warning btn-lg\' href=\'#\'>Button Text</a></div>'
      break

    case 'Poll':
      html += '<div class=\'alert alert-success alert-lg\' style=\'width: 500px\'><strong>POLL/SURVEY:</strong> '
      html += 'This is an example'
      html += '<a class=\'btn btn-success btn-lg\' href=\'#\'>Button Text</a></div>'
      break

    case 'Urgent':
      html += '<div class=\'alert alert-danger alert-lg\' style=\'width: 500px\'><strong>URGENT ALERT:</strong> '
      html += 'This is an example'
      html += '<a class=\'btn btn-danger btn-lg\' href=\'#\'>Button Text</a></div>'
      break
  }
  document.getElementById('selectedAlert').innerHTML = html
}
