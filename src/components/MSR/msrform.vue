<template>
  <b-container fluid class="contentHeight p-0" id="MainContainer">
    <b-toast id="form-toast" variant="warning" solid no-auto-hide>
      <template v-slot:toast-title>
        <div class="d-flex flex-grow-1 align-items-baseline">
          <b-img blank blank-color="#ff0000" class="mr-2" width="12" height="12"></b-img>
          <strong class="mr-auto">{{ busyTitle }}</strong>
        </div>
      </template>
      <b-spinner style="width: 7rem; height: 7rem;" variant="success" label="Waiting Spinner"></b-spinner>
    </b-toast>
    <div id="MsrForm" ref="MsrForm">
      <b-row class="bg-warning text-black formheader">
        <b-col cols="4" class="p-0 text-left"></b-col>
        <b-col cols="4" class="p-0 text-center">{{ headerText }}</b-col>
        <b-col cols="4" class="p-0 text-right"></b-col>
      </b-row>
      <b-row id="Tabs" class="tabrow formbody m-0">
        <b-card no-body>
          <b-tabs class="tabArea" card v-model="dashboardtabs">
            <b-tab :disabled="isSubcontractor" class="mtab Section1" active>
              <template slot="title">
                <font-awesome-icon fas icon="search-dollar" class="icon"></font-awesome-icon>
                Funding and Staffing Summary
              </template>
              <b-row>
                <b-col cols="12">
                  <div id="Section1" class="rtesection">
                    <b-card no-body>
                      <b-tabs v-model="fundingtabs" class="tabArea" card>
                        <b-tab class="mtab" active>
                          <template slot="title">
                            <font-awesome-icon fas icon="search-dollar" class="icon"></font-awesome-icon>
                            1.1 Funding
                          </template>
                          <b-row class="m-1">
                            <b-button :disabled="isEditing" class="formbutton" id="btn_Funding" ref="btn_Funding" variant="outline-danger" @click="handleit('edit', 'Funding', 'FundingForm')">Add/Edit Funding</b-button>
                          </b-row>
                          <b-form v-if="FundingForm">
                            <b-row>
                              <ejs-richtexteditor ref="rte_Funding" id="rte_Funding" height="600" :fontFamily="fontFamily" :cssClass="cssClass" v-model="Funding" :pasteCleanupSettings="pasteCleanupSettings" :toolbarSettings="toolbarSettings"></ejs-richtexteditor>
                            </b-row>
                            <b-row>
                              <b-button id="btn_Clear" ref="btn_Clear" class="formbutton" variant="warning" @click="handleit('clear', '', '')">Clear Contents</b-button>
                              <b-button id="btn_CancelFunding" ref="btn_CancelFunding" class="formbutton" variant="info" @click="handleit('cancel', 'Funding', 'FundingForm')">Cancel</b-button>
                              <b-button id="btn_SaveFunding" ref="btn_SaveFunding" class="formbutton ml-auto" variant="success" @click="handleit('save', 'Funding', 'FundingForm')" title="Inputs are complete for this section.">Complete</b-button>
                            </b-row>
                          </b-form>
                          <div v-else class="e-rte-content" id="FundingHtml" v-html="Funding"></div>
                        </b-tab>
                        <b-tab class="mtab">
                          <template slot="title">
                            <font-awesome-icon fas icon="search-dollar" class="icon"></font-awesome-icon>
                            1.2 Engineering Effort/Staffing
                          </template>
                          <b-row class="m-1">
                            <b-button :disabled="isEditing" class="formbutton" id="btn_Staffing" ref="btn_Staffing" variant="outline-danger" @click="handleit('edit', 'Staffing', 'StaffingForm')">Add/Edit Engineering Effort/Staffing</b-button>
                          </b-row>
                          <b-form v-if="StaffingForm">
                            <b-row>
                              <ejs-richtexteditor ref="rte_Staffing" id="rte_Staffing" height="600" :fontFamily="fontFamily" :cssClass="cssClass" v-model="Staffing" @change="onRTEChanged" :pasteCleanupSettings="pasteCleanupSettings" :toolbarSettings="toolbarSettings"></ejs-richtexteditor>
                            </b-row>
                            <b-row id="StaffingAnchor">
                              <b-button id="btn_Clear" ref="btn_Clear" class="formbutton" variant="warning" @click="handleit('clear', '', '')">Clear Contents</b-button>
                              <b-button id="btn_CancelStaffing" ref="btn_CancelStaffing" class="formbutton" variant="info" @click="handleit('cancel', 'Staffing', 'StaffingForm')">Cancel</b-button>
                              <b-button id="btn_SaveStaffing" ref="btn_SaveStaffing" class="formbutton ml-auto" variant="success" @click="handleit('save', 'Staffing', 'StaffingForm')" title="Inputs are complete for this section.">Complete</b-button>
                            </b-row>
                          </b-form>
                          <div v-else id="StaffingHtml" v-html="Staffing"></div>
                        </b-tab>
                        <b-tab class="mtab">
                          <template slot="title">
                            <font-awesome-icon fas icon="search-dollar" class="icon"></font-awesome-icon>
                            1.3 Cost Report
                          </template>
                          <b-row class="m-1">
                            <b-button :disabled="isEditing" class="formbutton" id="btn_CostReport" ref="btn_CostReport" variant="outline-danger" @click="handleit('edit', 'CostReport', 'CostReportForm')">Add/Edit Cost Report</b-button>
                          </b-row>
                          <b-form v-if="CostReportForm">
                            <b-row>
                              <ejs-richtexteditor ref="rte_CostReport" id="rte_CostReport" height="600" :fontFamily="fontFamily" :cssClass="cssClass" v-model="CostReport" @change="onRTEChanged" :pasteCleanupSettings="pasteCleanupSettings" :toolbarSettings="toolbarSettings"></ejs-richtexteditor>
                            </b-row>
                            <b-row id="CostReportAnchor">
                              <b-button id="btn_Clear" ref="btn_Clear" class="formbutton" variant="warning" @click="handleit('clear', '', '')">Clear Contents</b-button>
                              <b-button id="btn_CancelCostReport" ref="btn_CancelCostReport" class="formbutton" variant="info" @click="handleit('cancel', 'CostReport', 'CostReportForm')">Cancel</b-button>
                              <b-button id="btn_SaveCostReport" ref="btn_SaveCostReport" class="formbutton ml-auto" variant="success" @click="handleit('save', 'CostReport', 'CostReportForm')" title="Inputs are complete for this section.">Complete</b-button>
                            </b-row>
                          </b-form>
                          <div v-else id="CostReportHtml" v-html="CostReport"></div>
                        </b-tab>
                      </b-tabs>
                    </b-card>
                  </div>
                </b-col>
              </b-row>
            </b-tab>
            <b-tab :disabled="isSubcontractor" class="mtab Section2">
              <template slot="title">
                <font-awesome-icon fas icon="bus-alt" class="icon"></font-awesome-icon>
                Travel &amp; ODC
              </template>
              <b-row>
                <b-col cols="12">
                  <div id="Section2" class="rtesection">
                    <b-card no-body>
                      <b-tabs v-model="traveltabs" class="tabArea" card>
                        <b-tab class="mtab" active>
                          <template slot="title">
                            <font-awesome-icon fas icon="bus-alt" class="icon"></font-awesome-icon>
                            2.1.1 Travel Accomplished
                          </template>
                          <b-row class="m-1">
                            <b-button :disabled="isEditing" class="formbutton" id="btn_TravelAccomplished" ref="btn_TravelAccomplished" variant="outline-danger" @click="handleit('edit', 'TravelAccomplished', 'TravelAccomplishedForm')">Add/Edit Travel Accomplished</b-button>
                          </b-row>
                          <b-form v-if="TravelAccomplishedForm">
                            <b-row>
                              <ejs-richtexteditor ref="rte_TravelAccomplished" id="rte_TravelAccomplished" height="600" :fontFamily="fontFamily" :cssClass="cssClass" v-model="TravelAccomplished" :pasteCleanupSettings="pasteCleanupSettings" :toolbarSettings="toolbarSettings"></ejs-richtexteditor>
                            </b-row>
                            <b-row id="TravelAccomplishedAnchor">
                              <b-button id="btn_Clear" ref="btn_Clear" class="formbutton" variant="warning" @click="handleit('clear', '', '')">Clear Contents</b-button>
                              <b-button id="btn_CancelTravelAccomplished" ref="btn_CancelTravelAccomplished" class="formbutton" variant="info" @click="handleit('cancel', 'TravelAccomplished', 'TravelAccomplishedForm')">Cancel</b-button>
                              <b-button id="btn_SaveTravelAccomplished" ref="btn_SaveTravelAccomplished" class="formbutton ml-auto" variant="success" @click="handleit('save', 'TravelAccomplished', 'TravelAccomplishedForm')" title="Inputs are complete for this section.">Complete</b-button>
                            </b-row>
                          </b-form>
                          <div v-else id="TravelAccomplishedHtml" v-html="TravelAccomplished"></div>
                        </b-tab>
                        <b-tab class="mtab">
                          <template slot="title">
                            <font-awesome-icon fas icon="bus-alt" class="icon"></font-awesome-icon>
                            2.1.2 Travel Planned
                          </template>
                          <b-row class="m-1">
                            <b-button :disabled="isEditing" class="formbutton" id="btn_TravelPlanned" ref="btn_TravelPlanned" variant="outline-danger" @click="handleit('edit', 'TravelPlanned', 'TravelPlannedForm')">Add/Edit Travel Planned</b-button>
                          </b-row>
                          <b-form v-if="TravelPlannedForm">
                            <b-row>
                              <ejs-richtexteditor ref="rte_TravelPlanned" id="rte_TravelPlanned" height="600" :fontFamily="fontFamily" :cssClass="cssClass" v-model="TravelPlanned" :pasteCleanupSettings="pasteCleanupSettings" :toolbarSettings="toolbarSettings"></ejs-richtexteditor>
                            </b-row>
                            <b-row id="TravelPlannedAnchor">
                              <b-button id="btn_Clear" ref="btn_Clear" class="formbutton" variant="warning" @click="handleit('clear', '', '')">Clear Contents</b-button>
                              <b-button id="btn_CancelTravelPlanned" ref="btn_CancelTravelPlanned" class="formbutton" variant="info" @click="handleit('cancel', 'TravelPlanned', 'TravelPlannedForm')">Cancel</b-button>
                              <b-button id="btn_SaveTravelPlanned" ref="btn_SaveTravelPlanned" class="formbutton ml-auto" variant="success" @click="handleit('save', 'TravelPlanned', 'TravelPlannedForm')" title="Inputs are complete for this section.">Complete</b-button>
                            </b-row>
                          </b-form>
                          <div v-else id="TravelPlannedHtml" v-html="TravelPlanned"></div>
                        </b-tab>
                        <b-tab class="mtab">
                          <template slot="title">
                            <font-awesome-icon fas icon="bus-alt" class="icon"></font-awesome-icon>
                            2.1.3 Travel Costs To Date
                          </template>
                          <b-row class="m-1">
                            <b-button :disabled="isEditing" class="formbutton" id="btn_TravelCosts" ref="btn_TravelCosts" variant="outline-danger" @click="handleit('edit', 'TravelCosts', 'TravelCostsForm')">Add/Edit Travel Costs to Date</b-button>
                          </b-row>
                          <b-form v-if="TravelCostsForm">
                            <b-row>
                              <ejs-richtexteditor ref="rte_TravelCosts" id="rte_TravelCosts" height="600" :fontFamily="fontFamily" :cssClass="cssClass" v-model="TravelCosts" @change="onRTEChanged" :pasteCleanupSettings="pasteCleanupSettings" :toolbarSettings="toolbarSettings"></ejs-richtexteditor>
                            </b-row>
                            <b-row id="TravelCostsAnchor">
                              <b-button id="btn_Clear" ref="btn_Clear" class="formbutton" variant="warning" @click="handleit('clear', '', '')">Clear Contents</b-button>
                              <b-button id="btn_CancelTravelCosts" ref="btn_CancelTravelCosts" class="formbutton" variant="info" @click="handleit('cancel', 'TravelCosts', 'TravelCostsForm')">Cancel</b-button>
                              <b-button id="btn_SaveTravelCosts" ref="btn_SaveTravelCosts" class="formbutton ml-auto" variant="success" @click="handleit('save', 'TravelCosts', 'TravelCostsForm')" title="Inputs are complete for this section.">Complete</b-button>
                            </b-row>
                          </b-form>
                          <div v-else id="TravelCostsHtml" v-html="TravelCosts"></div>
                        </b-tab>
                        <b-tab class="mtab">
                          <template slot="title">
                            <font-awesome-icon fas icon="bus-alt" class="icon"></font-awesome-icon>
                            2.2.1 ODCs Accomplished
                          </template>
                          <b-row class="m-1">
                            <b-button :disabled="isEditing" class="formbutton" id="btn_ODCAccomplished" ref="btn_ODCAccomplished" variant="outline-danger" @click="handleit('edit', 'ODCAccomplished', 'ODCAccomplishedForm')">Add/Edit ODC Accomplished</b-button>
                          </b-row>
                          <b-form v-if="ODCAccomplishedForm">
                            <b-row>
                              <ejs-richtexteditor ref="rte_ODCAccomplished" id="rte_ODCAccomplished" height="600" :fontFamily="fontFamily" :cssClass="cssClass" v-model="ODCAccomplished" :pasteCleanupSettings="pasteCleanupSettings" :toolbarSettings="toolbarSettings"></ejs-richtexteditor>
                            </b-row>
                            <b-row id="ODCAccomplishedAnchor">
                              <b-button id="btn_Clear" ref="btn_Clear" class="formbutton" variant="warning" @click="handleit('clear', '', '')">Clear Contents</b-button>
                              <b-button id="btn_CancelODCAccomplished" ref="btn_CancelODCAccomplished" class="formbutton" variant="info" @click="handleit('cancel', 'ODCAccomplished', 'ODCAccomplishedForm')">Cancel</b-button>
                              <b-button id="btn_SaveODCAccomplished" ref="btn_SaveODCAccomplished" class="formbutton ml-auto" variant="success" @click="handleit('save', 'ODCAccomplished', 'ODCAccomplishedForm')" title="Inputs are complete for this section.">Complete</b-button>
                            </b-row>
                          </b-form>
                          <div v-else id="ODCAccomplishedHtml" v-html="ODCAccomplished"></div>
                        </b-tab>
                        <b-tab class="mtab">
                          <template slot="title">
                            <font-awesome-icon fas icon="bus-alt" class="icon"></font-awesome-icon>
                            2.2.2 ODCs Planned
                          </template>
                          <b-row class="m-1">
                            <b-button :disabled="isEditing" class="formbutton" id="btn_ODCPlanned" ref="btn_ODCPlanned" variant="outline-danger" @click="handleit('edit', 'ODCPlanned', 'ODCPlannedForm')">Add/Edit ODC Planned</b-button>
                          </b-row>
                          <b-form v-if="ODCPlannedForm">
                            <b-row>
                              <ejs-richtexteditor ref="rte_ODCPlanned" id="rte_ODCPlanned" height="600" :fontFamily="fontFamily" :cssClass="cssClass" v-model="ODCPlanned" :pasteCleanupSettings="pasteCleanupSettings" :toolbarSettings="toolbarSettings"></ejs-richtexteditor>
                            </b-row>
                            <b-row id="ODCPlannedAnchor">
                              <b-button id="btn_Clear" ref="btn_Clear" class="formbutton" variant="warning" @click="handleit('clear', '', '')">Clear Contents</b-button>
                              <b-button id="btn_CancelODCPlanned" ref="btn_CancelODCPlanned" class="formbutton" variant="info" @click="handleit('cancel', 'ODCPlanned', 'ODCPlannedForm')">Cancel</b-button>
                              <b-button id="btn_SaveODCPlanned" ref="btn_SaveODCPlanned" class="formbutton ml-auto" variant="success" @click="handleit('save', 'ODCPlanned', 'ODCPlannedForm')" title="Inputs are complete for this section.">Complete</b-button>
                            </b-row>
                          </b-form>
                          <div v-else id="ODCPlannedHtml" v-html="ODCPlanned"></div>
                        </b-tab>
                        <b-tab class="mtab">
                          <template slot="title">
                            <font-awesome-icon fas icon="bus-alt" class="icon"></font-awesome-icon>
                            2.2.3 ODC Costs To Date
                          </template>
                          <b-row class="m-1">
                            <b-button :disabled="isEditing" class="formbutton" id="btn_ODCCosts" ref="btn_ODCCosts" variant="outline-danger" @click="handleit('edit', 'ODCCosts', 'ODCCostsForm')">Add/Edit ODC Costs to Date</b-button>
                          </b-row>
                          <b-form v-if="ODCCostsForm">
                            <b-row>
                              <ejs-richtexteditor ref="rte_ODCCosts" id="rte_ODCCosts" height="600" :fontFamily="fontFamily" :cssClass="cssClass" v-model="ODCCosts" @change="onRTEChanged" :pasteCleanupSettings="pasteCleanupSettings" :toolbarSettings="toolbarSettings"></ejs-richtexteditor>
                            </b-row>
                            <b-row id="ODCCostsAnchor">
                              <b-button id="btn_Clear" ref="btn_Clear" class="formbutton" variant="warning" @click="handleit('clear', '', '')">Clear Contents</b-button>
                              <b-button id="btn_CancelODCCosts" ref="btn_CancelODCCosts" class="formbutton" variant="info" @click="handleit('cancel', 'ODCCosts', 'ODCCostsForm')">Cancel</b-button>
                              <b-button id="btn_SaveODCCosts" ref="btn_SaveODCCosts" class="formbutton ml-auto" variant="success" @click="handleit('save', 'ODCCosts', 'ODCCostsForm')" title="Inputs are complete for this section.">Complete</b-button>
                            </b-row>
                          </b-form>
                          <div v-else id="ODCCostsHtml" v-html="ODCCosts"></div>
                        </b-tab>
                      </b-tabs>
                    </b-card>
                  </div>
                </b-col>
              </b-row>
            </b-tab>
            <b-tab class="mtab Section3">
              <template slot="title">
                <font-awesome-icon fas icon="tasks" class="icon"></font-awesome-icon>
                Accomplishments
              </template>
              <div class="row">
                <b-col cols="12">
                  <div id="Section3Main" class="rtesection">
                    <b-row class="m-1">
                      <div class="m-1" v-if="!isSubcontractor">
                        <b-dropdown :disabled="isEditing" text="Edit Accomplishments" v-if="Accomplishments.length > 0" split split-variant="outline-danger" variant="danger">
                          <b-dropdown-item v-for="accomplishment in Accomplishments" :key="accomplishment" @click="handleit('editaccomplishment', accomplishment.Company, accomplishment.Index)">Edit {{ accomplishment.Company }} Accomplishments</b-dropdown-item>
                        </b-dropdown>
                      </div>
                      <div class="m-1" v-if="isSubcontractor && Accomplishments.length > 0">
                        <div v-for="accomplishment in Accomplishments" :key="accomplishment">
                          <b-button :disabled="isEditing" v-if="accomplishment.Company == Company && accomplishment.Completed == 'No'" class="formbutton" id="btn_Accomplishments" ref="btn_Accomplishments" variant="outline-danger" @click="handleit('editaccomplishment', accomplishment.Company, accomplishment.Index)">Edit Accomplishments</b-button>
                        </div>
                      </div>
                    </b-row>
                    <b-form v-if="AccomplishmentsForm">
                      <b-row>
                        <ejs-richtexteditor ref="rte_Accomplishments" id="rte_Accomplishments" height="600" :fontFamily="fontFamily" :cssClass="cssClass" v-model="SelectedAccomplishment" :pasteCleanupSettings="pasteCleanupSettings" :toolbarSettings="toolbarSettings"></ejs-richtexteditor>
                      </b-row>
                      <b-row id="AccomplishmentsAnchor">
                        <b-button id="btn_Clear" ref="btn_Clear" class="formbutton" variant="warning" @click="handleit('clearaccomplishment', '', '')">Clear Contents</b-button>
                        <b-button id="btn_CancelAccomplishments" ref="btn_CancelAccomplishments" class="formbutton" variant="info" @click="handleit('cancelaccomplishment', '', '')">Cancel</b-button>
                        <b-button id="btn_SaveAccomplishments" ref="btn_SaveAccomplishments" class="formbutton" variant="success" @click="handleit('saveaccomplishment', 'Accomplishments', 'AccomplishmentsForm')" title="Save and Edit Later">Save</b-button>
                        <b-button id="btn_PrivateAccomplishment" ref="btn_PrivateAccomplishment" class="formbutton" variant="primary" title="Ensure that others can't see the input" @click="handleit('privateaccomplishment', '', '')">Make Private</b-button>
                        <b-button id="btn_CompleteAccomplishment" ref="btn_CompleteAccomplishment" class="formbutton ml-auto" variant="success" title="Inputs are complete for this section." @click="handleit('completeaccomplishment', '', '')">Complete</b-button>
                      </b-row>
                    </b-form>
                    <div v-else id="Accomplishments">
                      <div v-for="accomplishment in Accomplishments" :key="accomplishment" class="text-left mb-2">
                        <div v-if="accomplishment.Private == 'Yes'">
                          <!-- PRIVATE -->
                          <div v-if="accomplishment.Completed == 'Yes'">
                            <!-- PRIVATE AND COMPLETED -->
                            <div v-if="isSubcontractor">
                              <div v-if="accomplishment.Company == Company">
                                <!-- SUBCONTRACTOR OF COMPANY CAN SEE THE ITEM WHILE OTHER SUBCONTRACTORS CAN NOT. -->
                                <b-card border-variant="success" text-variant="dark">
                                  <template v-slot:header>
                                    <h3 class="mb-0">
                                      <span class="ml-0">{{ accomplishment.Company }}</span>
                                      <font-awesome-icon fas icon="user-shield" class="icon text-danger float-right ml-1"></font-awesome-icon>
                                      <font-awesome-icon fas icon="folder" class="icon text-success float-right ml-1"></font-awesome-icon>
                                    </h3>
                                  </template>
                                  <b-card-body v-html="accomplishment.HTML"></b-card-body>
                                </b-card>
                              </div>
                            </div>
                            <div v-else>
                              <b-card border-variant="success" text-variant="dark">
                                <template v-slot:header>
                                  <h3 class="mb-0">
                                    <span class="ml-0">{{ accomplishment.Company }}</span>
                                    <font-awesome-icon fas icon="user-shield" class="icon text-danger float-right ml-1"></font-awesome-icon>
                                    <font-awesome-icon fas icon="folder" class="icon text-success float-right ml-1"></font-awesome-icon>
                                  </h3>
                                </template>
                                <b-card-body v-html="accomplishment.HTML"></b-card-body>
                              </b-card>
                            </div>
                          </div>
                          <!-- PRIVATE BUT NOT COMPLETED (DENOTED BY 'WARNING COLOR) -->
                          <div v-else>
                            <div v-if="isSubcontractor">
                              <div v-if="accomplishment.Company == Company">
                                <!-- SUBCONTRACTOR OF COMPANY CAN SEE THE ITEM WHILE OTHER SUBCONTRACTORS CAN NOT. -->
                                <b-card border-variant="warning" text-variant="dark">
                                  <template v-slot:header>
                                    <h3 class="mb-0">
                                      <span class="ml-0">{{ accomplishment.Company }}</span>
                                      <font-awesome-icon fas icon="user-shield" class="icon text-danger float-right ml-1"></font-awesome-icon>
                                      <font-awesome-icon fas icon="folder-open" class="icon text-warning float-right ml-1"></font-awesome-icon>
                                    </h3>
                                  </template>
                                  <b-card-body v-html="accomplishment.HTML"></b-card-body>
                                </b-card>
                              </div>
                            </div>
                            <div v-else>
                              <!-- Workplan Manager ABLE TO SEE ITEM. -->
                              <b-card border-variant="warning" text-variant="dark">
                                <template v-slot:header>
                                  <h3 class="mb-0">
                                    <span class="ml-0">{{ accomplishment.Company }}</span>
                                    <font-awesome-icon fas icon="user-shield" class="icon text-danger float-right ml-1"></font-awesome-icon>
                                    <font-awesome-icon fas icon="folder-open" class="icon text-warning float-right ml-1"></font-awesome-icon>
                                  </h3>
                                </template>
                                <b-card-body v-html="accomplishment.HTML"></b-card-body>
                              </b-card>
                            </div>
                          </div>
                        </div>
                        <div v-else>
                          <!-- NOT PRIVATE -->
                          <div v-if="accomplishment.Completed == 'Yes'">
                            <!-- NOT PRIVATE AND COMPLETED -->
                            <b-card border-variant="success" text-variant="dark">
                              <template v-slot:header>
                                <h3 class="mb-0">
                                  <span class="ml-0">{{ accomplishment.Company }}</span>
                                  <font-awesome-icon fas icon="folder" class="icon text-success float-right ml-1"></font-awesome-icon>
                                </h3>
                              </template>
                              <b-card-body v-html="accomplishment.HTML"></b-card-body>
                            </b-card>
                          </div>
                          <div v-else>
                            <!-- NOT PRIVATE AND NOT COMPLETED -->
                            <div v-if="isSubcontractor">
                              <div v-if="accomplishment.Company == Company">
                                <b-card border-variant="warning" text-variant="dark">
                                  <template v-slot:header>
                                    <h3 class="mb-0">
                                      <span class="ml-0">{{ accomplishment.Company }}</span>
                                      <font-awesome-icon fas icon="folder-open" class="icon text-warning float-right ml-1"></font-awesome-icon>
                                    </h3>
                                  </template>
                                  <b-card-body v-html="accomplishment.HTML"></b-card-body>
                                </b-card>
                              </div>
                            </div>
                            <div v-else>
                              <!-- Workplan Manager ABLE TO SEE ITEM. -->
                              <b-card border-variant="warning" text-variant="dark">
                                <template v-slot:header>
                                  <h3 class="mb-0">
                                    <span class="ml-0">{{ accomplishment.Company }}</span>
                                    <font-awesome-icon fas icon="folder-open" class="icon text-warning float-right ml-1"></font-awesome-icon>
                                  </h3>
                                </template>
                                <b-card-body v-html="accomplishment.HTML"></b-card-body>
                              </b-card>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </b-col>
              </div>
            </b-tab>
            <b-tab class="mtab Section4">
              <template slot="title">
                <font-awesome-icon fas icon="ruler-combined" class="icon"></font-awesome-icon>
                Plans
              </template>
              <div class="row">
                <b-col cols="12">
                  <div id="Section4Main" class="rtesection">
                    <b-row class="m-1">
                      <div class="m-1" v-if="!isSubcontractor">
                        <b-dropdown :disabled="isEditing" text="Edit Plans" v-if="Plans.length > 0" split split-variant="outline-danger" variant="danger">
                          <b-dropdown-item v-for="plan in Plans" :key="plan" @click="handleit('editplan', plan.Company, plan.Index)">Edit {{ plan.Company }} Plans</b-dropdown-item>
                        </b-dropdown>
                      </div>
                      <div class="m-1" v-if="isSubcontractor && Plans.length > 0">
                        <div v-for="plan in Plans" :key="plan">
                          <b-button :disabled="isEditing" v-if="plan.Company == Company && plan.Completed == 'No'" class="formbutton" id="btn_Plans" ref="btn_Plans" variant="outline-danger" @click="handleit('editplan', plan.Company, plan.Index)">Edit Plans</b-button>
                        </div>
                      </div>
                    </b-row>
                    <b-form v-if="PlansForm">
                      <b-row>
                        <ejs-richtexteditor ref="rte_Plans" id="rte_Plans" height="600" :fontFamily="fontFamily" :cssClass="cssClass" v-model="SelectedPlan" :pasteCleanupSettings="pasteCleanupSettings" :toolbarSettings="toolbarSettings"></ejs-richtexteditor>
                      </b-row>
                      <b-row id="PlansAnchor">
                        <b-button id="btn_Clear" ref="btn_Clear" class="formbutton" variant="warning" @click="handleit('clearplan', '', '')">Clear Contents</b-button>
                        <b-button id="btn_CancelPlans" ref="btn_CancelPlans" class="formbutton" variant="info" @click="handleit('cancelplan', '', '')">Cancel</b-button>
                        <b-button id="btn_SavePlans" ref="btn_SavePlans" class="formbutton" variant="success" @click="handleit('saveplan', 'Plans', 'PlansForm')" title="Save and Edit Later">Save</b-button>
                        <b-button id="btn_PrivatePlan" ref="btn_PrivatePlan" class="formbutton" variant="primary" title="Ensure that others can't see the input" @click="handleit('privateplan', '', '')">Make Private</b-button>
                        <b-button id="btn_CompletePlan" ref="btn_CompletePlan" class="formbutton ml-auto" variant="success" title="Inputs are complete for this section." @click="handleit('completeplan', '', '')">Complete</b-button>
                      </b-row>
                    </b-form>
                    <div v-else id="Plans">
                      <div v-for="plan in Plans" :key="plan" class="text-left mb-2">
                        <div v-if="plan.Private == 'Yes'">
                          <!-- PRIVATE -->
                          <div v-if="plan.Completed == 'Yes'">
                            <!-- PRIVATE AND COMPLETED -->
                            <div v-if="isSubcontractor">
                              <div v-if="plan.Company == Company">
                                <!-- SUBCONTRACTOR OF COMPANY CAN SEE THE ITEM WHILE OTHER SUBCONTRACTORS CAN NOT. -->
                                <b-card border-variant="success" text-variant="dark">
                                  <template v-slot:header>
                                    <h3 class="mb-0">
                                      <span class="ml-0">{{ plan.Company }}</span>
                                      <font-awesome-icon fas icon="user-shield" class="icon text-danger float-right ml-1"></font-awesome-icon>
                                      <font-awesome-icon fas icon="folder" class="icon text-success float-right ml-1"></font-awesome-icon>
                                    </h3>
                                  </template>
                                  <b-card-body v-html="plan.HTML"></b-card-body>
                                </b-card>
                              </div>
                            </div>
                            <div v-else>
                              <b-card border-variant="success" text-variant="dark">
                                <template v-slot:header>
                                  <h3 class="mb-0">
                                    <span class="ml-0">{{ plan.Company }}</span>
                                    <font-awesome-icon fas icon="user-shield" class="icon text-danger float-right ml-1"></font-awesome-icon>
                                    <font-awesome-icon fas icon="folder" class="icon text-success float-right ml-1"></font-awesome-icon>
                                  </h3>
                                </template>
                                <b-card-body v-html="plan.HTML"></b-card-body>
                              </b-card>
                            </div>
                          </div>
                          <!-- PRIVATE BUT NOT COMPLETED (DENOTED BY 'WARNING COLOR) -->
                          <div v-else>
                            <div v-if="isSubcontractor">
                              <div v-if="plan.Company == Company">
                                <!-- SUBCONTRACTOR OF COMPANY CAN SEE THE ITEM WHILE OTHER SUBCONTRACTORS CAN NOT. -->
                                <b-card border-variant="warning" text-variant="dark">
                                  <template v-slot:header>
                                    <h3 class="mb-0">
                                      <span class="ml-0">{{ plan.Company }}</span>
                                      <font-awesome-icon fas icon="user-shield" class="icon text-danger float-right ml-1"></font-awesome-icon>
                                      <font-awesome-icon fas icon="folder-open" class="icon text-warning float-right ml-1"></font-awesome-icon>
                                    </h3>
                                  </template>
                                  <b-card-body v-html="plan.HTML"></b-card-body>
                                </b-card>
                              </div>
                            </div>
                            <div v-else>
                              <!-- OTHER USERS ABLE TO SEE ITEM. -->
                              <b-card border-variant="warning" text-variant="dark">
                                <template v-slot:header>
                                  <h3 class="mb-0">
                                    <span class="ml-0">{{ plan.Company }}</span>
                                    <font-awesome-icon fas icon="user-shield" class="icon text-danger float-right ml-1"></font-awesome-icon>
                                    <font-awesome-icon fas icon="folder-open" class="icon text-warning float-right ml-1"></font-awesome-icon>
                                  </h3>
                                </template>
                                <b-card-body v-html="plan.HTML"></b-card-body>
                              </b-card>
                            </div>
                          </div>
                        </div>
                        <div v-else>
                          <!-- NOT PRIVATE -->
                          <div v-if="plan.Completed == 'Yes'">
                            <!-- NOT PRIVATE AND COMPLETED -->
                            <b-card border-variant="success" text-variant="dark">
                              <template v-slot:header>
                                <h3 class="mb-0">
                                  <span class="ml-0">{{ plan.Company }}</span>
                                  <font-awesome-icon fas icon="folder" class="icon text-success float-right ml-1"></font-awesome-icon>
                                </h3>
                              </template>
                              <b-card-body v-html="plan.HTML"></b-card-body>
                            </b-card>
                          </div>
                          <div v-else>
                            <!-- NOT PRIVATE AND NOT COMPLETED -->
                            <div v-if="isSubcontractor">
                              <div v-if="plan.Company == Company">
                                <b-card border-variant="warning" text-variant="dark">
                                  <template v-slot:header>
                                    <h3 class="mb-0">
                                      <span class="ml-0">{{ plan.Company }}</span>
                                      <font-awesome-icon fas icon="folder-open" class="icon text-warning float-right ml-1"></font-awesome-icon>
                                    </h3>
                                  </template>
                                  <b-card-body v-html="plan.HTML"></b-card-body>
                                </b-card>
                              </div>
                            </div>
                            <div v-else>
                              <b-card border-variant="warning" text-variant="dark">
                                <template v-slot:header>
                                  <h3 class="mb-0">
                                    <span class="ml-0">{{ plan.Company }}</span>
                                    <font-awesome-icon fas icon="folder-open" class="icon text-warning float-right ml-1"></font-awesome-icon>
                                  </h3>
                                </template>
                                <b-card-body v-html="plan.HTML"></b-card-body>
                              </b-card>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </b-col>
              </div>
            </b-tab>
            <b-tab class="mtab Section5">
              <template slot="title">
                <font-awesome-icon fas icon="microscope" class="icon"></font-awesome-icon>
                Assumptions, Risks, Opportunities
              </template>
              <b-row>
                <b-col cols="12">
                  <div id="Section5Main" class="rtesection">
                    <b-card no-body>
                      <b-tabs v-model="arotabs" class="tabArea" card>
                        <b-tab class="mtab" active>
                          <template slot="title">
                            <font-awesome-icon fas icon="microscope" class="icon"></font-awesome-icon>
                            Assumptions and Dependencies
                          </template>
                          <b-row class="m-1">
                            <div class="m-1" v-if="!isSubcontractor">
                              <b-dropdown :disabled="isEditing" text="Edit Assumptions" v-if="Assumptions.length > 0" split split-variant="outline-danger" variant="danger">
                                <b-dropdown-item v-for="assumption in Assumptions" :key="assumption" @click="handleit('editassumption', assumption.Company, assumption.Index)">Edit {{ assumption.Company }} Assumptions</b-dropdown-item>
                              </b-dropdown>
                            </div>
                            <div class="m-1" v-if="isSubcontractor && Assumptions.length > 0">
                              <div v-for="assumption in Assumptions" :key="assumption">
                                <b-button :disabled="isEditing" v-if="assumption.Company == Company && assumption.Completed == 'No'" class="formbutton" id="btn_Assumptions" ref="btn_Assumptions" variant="outline-danger" @click="handleit('editassumption', assumption.Company, assumption.Index)">Edit Assumptions</b-button>
                              </div>
                            </div>
                          </b-row>
                          <b-form v-if="AssumptionsForm">
                            <b-row>
                              <ejs-richtexteditor ref="rte_Assumptions" id="rte_Assumptions" height="600" :fontFamily="fontFamily" :cssClass="cssClass" v-model="SelectedAssumption" :pasteCleanupSettings="pasteCleanupSettings" :toolbarSettings="toolbarSettings"></ejs-richtexteditor>
                            </b-row>
                            <b-row id="AssumptionsAnchor">
                              <b-button id="btn_Clear" ref="btn_Clear" class="formbutton" variant="warning" @click="handleit('clearassumption', '', '')">Clear Contents</b-button>
                              <b-button id="btn_CancelAssumptions" ref="btn_CancelAssumptions" class="formbutton" variant="info" @click="handleit('cancelassumption', '', '')">Cancel</b-button>
                              <b-button id="btn_SaveAssumptions" ref="btn_SaveAssumptions" class="formbutton" variant="success" @click="handleit('saveassumption', 'Assumptions', 'AssumptionsForm')" title="Save and Edit Later">Save</b-button>
                              <b-button id="btn_PrivateAssumption" ref="btn_PrivateAssumption" class="formbutton" variant="primary" title="Ensure that others can't see the input" @click="handleit('privateassumption', '', '')">Make Private</b-button>
                              <b-button id="btn_CompleteAssumption" ref="btn_CompleteAssumption" class="formbutton ml-auto" variant="success" title="Inputs are complete for this section." @click="handleit('completeassumption', '', '')">Complete</b-button>
                            </b-row>
                          </b-form>
                          <div v-else id="Assumptions">
                            <div v-for="assumption in Assumptions" :key="assumption" class="text-left mb-2">
                              <div v-if="assumption.Private == 'Yes'">
                                <!-- PRIVATE -->
                                <div v-if="assumption.Completed == 'Yes'">
                                  <!-- PRIVATE AND COMPLETED -->
                                  <div v-if="isSubcontractor">
                                    <div v-if="assumption.Company == Company">
                                      <!-- SUBCONTRACTOR OF COMPANY CAN SEE THE ITEM WHILE OTHER SUBCONTRACTORS CAN NOT. -->
                                      <b-card border-variant="success" text-variant="dark">
                                        <template v-slot:header>
                                          <h3 class="mb-0">
                                            <span class="ml-0">{{ assumption.Company }}</span>
                                            <font-awesome-icon fas icon="user-shield" class="icon text-danger float-right ml-1"></font-awesome-icon>
                                            <font-awesome-icon fas icon="folder" class="icon text-success float-right ml-1"></font-awesome-icon>
                                          </h3>
                                        </template>
                                        <b-card-body v-html="assumption.HTML"></b-card-body>
                                      </b-card>
                                    </div>
                                  </div>
                                  <div v-else>
                                    <b-card border-variant="success" text-variant="dark">
                                      <template v-slot:header>
                                        <h3 class="mb-0">
                                          <span class="ml-0">{{ assumption.Company }}</span>
                                          <font-awesome-icon fas icon="user-shield" class="icon text-danger float-right ml-1"></font-awesome-icon>
                                          <font-awesome-icon fas icon="folder" class="icon text-success float-right ml-1"></font-awesome-icon>
                                        </h3>
                                      </template>
                                      <b-card-body v-html="assumption.HTML"></b-card-body>
                                    </b-card>
                                  </div>
                                </div>
                                <!-- PRIVATE BUT NOT COMPLETED (DENOTED BY 'WARNING COLOR) -->
                                <div v-else>
                                  <div v-if="isSubcontractor">
                                    <div v-if="assumption.Company == Company">
                                      <!-- SUBCONTRACTOR OF COMPANY CAN SEE THE ITEM WHILE OTHER SUBCONTRACTORS CAN NOT. -->
                                      <b-card border-variant="warning" text-variant="dark">
                                        <template v-slot:header>
                                          <h3 class="mb-0">
                                            <span class="ml-0">{{ assumption.Company }}</span>
                                            <font-awesome-icon fas icon="user-shield" class="icon text-danger float-right ml-1"></font-awesome-icon>
                                            <font-awesome-icon fas icon="folder-open" class="icon text-warning float-right ml-1"></font-awesome-icon>
                                          </h3>
                                        </template>
                                        <b-card-body v-html="assumption.HTML"></b-card-body>
                                      </b-card>
                                    </div>
                                  </div>
                                  <div v-else>
                                    <!-- OTHER USERS ABLE TO SEE ITEM. -->
                                    <b-card border-variant="warning" text-variant="dark">
                                      <template v-slot:header>
                                        <h3 class="mb-0">
                                          <span class="ml-0">{{ assumption.Company }}</span>
                                          <font-awesome-icon fas icon="user-shield" class="icon text-danger float-right ml-1"></font-awesome-icon>
                                          <font-awesome-icon fas icon="folder-open" class="icon text-warning float-right ml-1"></font-awesome-icon>
                                        </h3>
                                      </template>
                                      <b-card-body v-html="assumption.HTML"></b-card-body>
                                    </b-card>
                                  </div>
                                </div>
                              </div>
                              <div v-else>
                                <!-- NOT PRIVATE -->
                                <div v-if="assumption.Completed == 'Yes'">
                                  <!-- NOT PRIVATE AND COMPLETED -->
                                  <b-card border-variant="success" text-variant="dark">
                                    <template v-slot:header>
                                      <h3 class="mb-0">
                                        <span class="ml-0">{{ assumption.Company }}</span>
                                        <font-awesome-icon fas icon="folder" class="icon text-success float-right ml-1"></font-awesome-icon>
                                      </h3>
                                    </template>
                                    <b-card-body v-html="assumption.HTML"></b-card-body>
                                  </b-card>
                                </div>
                                <div v-else>
                                  <!-- NOT PRIVATE AND NOT COMPLETED -->
                                  <div v-if="isSubcontractor">
                                    <div v-if="assumption.Company == Company">
                                      <b-card border-variant="warning" text-variant="dark">
                                        <template v-slot:header>
                                          <h3 class="mb-0">
                                            <span class="ml-0">{{ assumption.Company }}</span>
                                            <font-awesome-icon fas icon="folder-open" class="icon text-warning float-right ml-1"></font-awesome-icon>
                                          </h3>
                                        </template>
                                        <b-card-body v-html="assumption.HTML"></b-card-body>
                                      </b-card>
                                    </div>
                                  </div>
                                  <div v-else>
                                    <b-card border-variant="warning" text-variant="dark">
                                      <template v-slot:header>
                                        <h3 class="mb-0">
                                          <span class="ml-0">{{ assumption.Company }}</span>
                                          <font-awesome-icon fas icon="folder-open" class="icon text-warning float-right ml-1"></font-awesome-icon>
                                        </h3>
                                      </template>
                                      <b-card-body v-html="assumption.HTML"></b-card-body>
                                    </b-card>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </b-tab>
                        <b-tab class="mtab">
                          <template slot="title">
                            <font-awesome-icon fas icon="microscope" class="icon"></font-awesome-icon>
                            Risks and Mitigation
                          </template>
                          <b-row class="m-1">
                            <div class="m-1" v-if="!isSubcontractor">
                              <b-dropdown :disabled="isEditing" text="Edit Risks" v-if="Risks.length > 0" split split-variant="outline-danger" variant="danger">
                                <b-dropdown-item v-for="risk in Risks" :key="risk" @click="handleit('editrisk', risk.Company, risk.Index)">Edit {{ risk.Company }} Risks</b-dropdown-item>
                              </b-dropdown>
                            </div>
                            <div class="m-1" v-if="isSubcontractor && Risks.length > 0">
                              <div v-for="risk in Risks" :key="risk">
                                <b-button :disabled="isEditing" v-if="risk.Company == Company && risk.Completed == 'No'" class="formbutton" id="btn_Risks" ref="btn_Risks" variant="outline-danger" @click="handleit('editrisk', risk.Company, risk.Index)">Edit Risks</b-button>
                              </div>
                            </div>
                          </b-row>
                          <b-form v-if="RisksForm">
                            <b-row>
                              <ejs-richtexteditor ref="rte_Risks" id="rte_Risks" height="600" class="rtesection" v-model="SelectedRisk" :pasteCleanupSettings="pasteCleanupSettings" :toolbarSettings="toolbarSettings"></ejs-richtexteditor>
                            </b-row>
                            <b-row id="RisksAnchor">
                              <b-button id="btn_Clear" ref="btn_Clear" class="formbutton" variant="warning" @click="handleit('clearrisk', '', '')">Clear Contents</b-button>
                              <b-button id="btn_CancelRisks" ref="btn_CancelRisks" class="formbutton" variant="info" @click="handleit('cancelrisk', '', '')">Cancel</b-button>
                              <b-button id="btn_SaveRisks" ref="btn_SaveRisks" class="formbutton" variant="success" @click="handleit('saverisk', 'Risks', 'RisksForm')" title="Save and Edit Later">Save</b-button>
                              <b-button id="btn_PrivateRisk" ref="btn_PrivateRisk" class="formbutton" variant="primary" title="Ensure that others can't see the input" @click="handleit('privaterisk', '', '')">Make Private</b-button>
                              <b-button id="btn_CompleteRisk" ref="btn_CompleteRisk" class="formbutton ml-auto" variant="success" title="Inputs are complete for this section." @click="handleit('completerisk', '', '')">Complete</b-button>
                            </b-row>
                          </b-form>
                          <div v-else id="Risks">
                            <div v-for="risk in Risks" :key="risk" class="text-left mb-2">
                              <div v-if="risk.Private == 'Yes'">
                                <!-- PRIVATE -->
                                <div v-if="risk.Completed == 'Yes'">
                                  <!-- PRIVATE AND COMPLETED -->
                                  <div v-if="isSubcontractor">
                                    <div v-if="risk.Company == Company">
                                      <!-- SUBCONTRACTOR OF COMPANY CAN SEE THE ITEM WHILE OTHER SUBCONTRACTORS CAN NOT. -->
                                      <b-card border-variant="success" text-variant="dark">
                                        <template v-slot:header>
                                          <h3 class="mb-0">
                                            <span class="ml-0">{{ risk.Company }}</span>
                                            <font-awesome-icon fas icon="user-shield" class="icon text-danger float-right ml-1"></font-awesome-icon>
                                            <font-awesome-icon fas icon="folder" class="icon text-success float-right ml-1"></font-awesome-icon>
                                          </h3>
                                        </template>
                                        <b-card-body v-html="risk.HTML"></b-card-body>
                                      </b-card>
                                    </div>
                                  </div>
                                  <div v-else>
                                    <b-card border-variant="success" text-variant="dark">
                                      <template v-slot:header>
                                        <h3 class="mb-0">
                                          <span class="ml-0">{{ risk.Company }}</span>
                                          <font-awesome-icon fas icon="user-shield" class="icon text-danger float-right ml-1"></font-awesome-icon>
                                          <font-awesome-icon fas icon="folder" class="icon text-success float-right ml-1"></font-awesome-icon>
                                        </h3>
                                      </template>
                                      <b-card-body v-html="risk.HTML"></b-card-body>
                                    </b-card>
                                  </div>
                                </div>
                                <!-- PRIVATE BUT NOT COMPLETED (DENOTED BY 'WARNING COLOR) -->
                                <div v-else>
                                  <div v-if="isSubcontractor">
                                    <div v-if="risk.Company == Company">
                                      <!-- SUBCONTRACTOR OF COMPANY CAN SEE THE ITEM WHILE OTHER SUBCONTRACTORS CAN NOT. -->
                                      <b-card border-variant="warning" text-variant="dark">
                                        <template v-slot:header>
                                          <h3 class="mb-0">
                                            <span class="ml-0">{{ risk.Company }}</span>
                                            <font-awesome-icon fas icon="user-shield" class="icon text-danger float-right ml-1"></font-awesome-icon>
                                            <font-awesome-icon fas icon="folder-open" class="icon text-warning float-right ml-1"></font-awesome-icon>
                                          </h3>
                                        </template>
                                        <b-card-body v-html="risk.HTML"></b-card-body>
                                      </b-card>
                                    </div>
                                  </div>
                                  <div v-else>
                                    <!-- OTHER USERS ABLE TO SEE ITEM. -->
                                    <b-card border-variant="warning" text-variant="dark">
                                      <template v-slot:header>
                                        <h3 class="mb-0">
                                          <span class="ml-0">{{ risk.Company }}</span>
                                          <font-awesome-icon fas icon="user-shield" class="icon text-danger float-right ml-1"></font-awesome-icon>
                                          <font-awesome-icon fas icon="folder-open" class="icon text-warning float-right ml-1"></font-awesome-icon>
                                        </h3>
                                      </template>
                                      <b-card-body v-html="risk.HTML"></b-card-body>
                                    </b-card>
                                  </div>
                                </div>
                              </div>
                              <div v-else>
                                <!-- NOT PRIVATE -->
                                <div v-if="risk.Completed == 'Yes'">
                                  <!-- NOT PRIVATE AND COMPLETED -->
                                  <b-card border-variant="success" text-variant="dark">
                                    <template v-slot:header>
                                      <h3 class="mb-0">
                                        <span class="ml-0">{{ risk.Company }}</span>
                                        <font-awesome-icon fas icon="folder" class="icon text-success float-right ml-1"></font-awesome-icon>
                                      </h3>
                                    </template>
                                    <b-card-body v-html="risk.HTML"></b-card-body>
                                  </b-card>
                                </div>
                                <div v-else>
                                  <!-- NOT PRIVATE AND NOT COMPLETED -->
                                  <div v-if="isSubcontractor">
                                    <div v-if="risk.Company == Company">
                                      <b-card border-variant="warning" text-variant="dark">
                                        <template v-slot:header>
                                          <h3 class="mb-0">
                                            <span class="ml-0">{{ risk.Company }}</span>
                                            <font-awesome-icon fas icon="folder-open" class="icon text-warning float-right ml-1"></font-awesome-icon>
                                          </h3>
                                        </template>
                                        <b-card-body v-html="risk.HTML"></b-card-body>
                                      </b-card>
                                    </div>
                                  </div>
                                  <div v-else>
                                    <b-card border-variant="warning" text-variant="dark">
                                      <template v-slot:header>
                                        <h3 class="mb-0">
                                          <span class="ml-0">{{ risk.Company }}</span>
                                          <font-awesome-icon fas icon="folder-open" class="icon text-warning float-right ml-1"></font-awesome-icon>
                                        </h3>
                                      </template>
                                      <b-card-body v-html="risk.HTML"></b-card-body>
                                    </b-card>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </b-tab>
                        <b-tab class="mtab">
                          <template slot="title">
                            <font-awesome-icon fas icon="microscope" class="icon"></font-awesome-icon>
                            Opportunities
                          </template>
                          <b-row class="m-1">
                            <div class="m-1" v-if="!isSubcontractor">
                              <b-dropdown :disabled="isEditing" text="Edit Opportunities" v-if="Opportunities.length > 0" split split-variant="outline-danger" variant="danger">
                                <b-dropdown-item v-for="opportunity in Opportunities" :key="opportunity" @click="handleit('editopportunity', opportunity.Company, opportunity.Index)">Edit {{ opportunity.Company }} Opportunities</b-dropdown-item>
                              </b-dropdown>
                            </div>
                            <div class="m-1" v-if="isSubcontractor && Opportunities.length > 0">
                              <div v-for="opportunity in Opportunities" :key="opportunity">
                                <b-button :disabled="isEditing" v-if="opportunity.Company == Company && opportunity.Completed == 'No'" class="formbutton" id="btn_Opportunities" ref="btn_Opportunities" variant="outline-danger" @click="handleit('editopportunity', opportunity.Company, opportunity.Index)">Edit Opportunities</b-button>
                              </div>
                            </div>
                          </b-row>
                          <b-form v-if="OpportunitiesForm">
                            <b-row>
                              <ejs-richtexteditor ref="rte_Opportunities" id="rte_Opportunities" height="600" class="rtesection" v-model="SelectedOpportunity" :pasteCleanupSettings="pasteCleanupSettings" :toolbarSettings="toolbarSettings"></ejs-richtexteditor>
                            </b-row>
                            <b-row id="OpportunitiesAnchor">
                              <b-button id="btn_Clear" ref="btn_Clear" class="formbutton" variant="warning" @click="handleit('clearopportunity', '', '')">Clear Contents</b-button>
                              <b-button id="btn_CancelOpportunitys" ref="btn_CancelOpportunitys" class="formbutton" variant="info" @click="handleit('cancelopportunity', '', '')">Cancel</b-button>
                              <b-button id="btn_SaveOpportunitys" ref="btn_SaveOpportunitys" class="formbutton" variant="success" @click="handleit('saveopportunity', 'Opportunities', 'OpportunitiesForm')" title="Save and Edit Later">Save</b-button>
                              <b-button id="btn_PrivateOpportunity" ref="btn_PrivateOpportunity" class="formbutton" variant="primary" title="Ensure that others can't see the input" @click="handleit('privateopportunity', '', '')">Make Private</b-button>
                              <b-button id="btn_CompleteOpportunity" ref="btn_CompleteOpportunity" class="formbutton ml-auto" variant="success" title="Inputs are complete for this section." @click="handleit('completeopportunity', '', '')">Complete</b-button>
                            </b-row>
                          </b-form>
                          <div v-else id="Opportunities">
                            <div v-for="opportunity in Opportunities" :key="opportunity" class="text-left mb-2">
                              <div v-if="opportunity.Private == 'Yes'">
                                <!-- PRIVATE -->
                                <div v-if="opportunity.Completed == 'Yes'">
                                  <!-- PRIVATE AND COMPLETED -->
                                  <div v-if="isSubcontractor">
                                    <div v-if="opportunity.Company == Company">
                                      <!-- SUBCONTRACTOR OF COMPANY CAN SEE THE ITEM WHILE OTHER SUBCONTRACTORS CAN NOT. -->
                                      <b-card border-variant="success" text-variant="dark">
                                        <template v-slot:header>
                                          <h3 class="mb-0">
                                            <span class="ml-0">{{ opportunity.Company }}</span>
                                            <font-awesome-icon fas icon="user-shield" class="icon text-danger float-right ml-1"></font-awesome-icon>
                                            <font-awesome-icon fas icon="folder" class="icon text-success float-right ml-1"></font-awesome-icon>
                                          </h3>
                                        </template>
                                        <b-card-body v-html="opportunity.HTML"></b-card-body>
                                      </b-card>
                                    </div>
                                  </div>
                                  <div v-else>
                                    <b-card border-variant="success" text-variant="dark">
                                      <template v-slot:header>
                                        <h3 class="mb-0">
                                          <span class="ml-0">{{ opportunity.Company }}</span>
                                          <font-awesome-icon fas icon="user-shield" class="icon text-danger float-right ml-1"></font-awesome-icon>
                                          <font-awesome-icon fas icon="folder" class="icon text-success float-right ml-1"></font-awesome-icon>
                                        </h3>
                                      </template>
                                      <b-card-body v-html="opportunity.HTML"></b-card-body>
                                    </b-card>
                                  </div>
                                </div>
                                <!-- PRIVATE BUT NOT COMPLETED (DENOTED BY 'WARNING COLOR) -->
                                <div v-else>
                                  <div v-if="isSubcontractor">
                                    <div v-if="opportunity.Company == Company">
                                      <!-- SUBCONTRACTOR OF COMPANY CAN SEE THE ITEM WHILE OTHER SUBCONTRACTORS CAN NOT. -->
                                      <b-card border-variant="warning" text-variant="dark">
                                        <template v-slot:header>
                                          <h3 class="mb-0">
                                            <span class="ml-0">{{ opportunity.Company }}</span>
                                            <font-awesome-icon fas icon="user-shield" class="icon text-danger float-right ml-1"></font-awesome-icon>
                                            <font-awesome-icon fas icon="folder-open" class="icon text-warning float-right ml-1"></font-awesome-icon>
                                          </h3>
                                        </template>
                                        <b-card-body v-html="opportunity.HTML"></b-card-body>
                                      </b-card>
                                    </div>
                                  </div>
                                  <div v-else>
                                    <!-- OTHER USERS ABLE TO SEE ITEM. -->
                                    <b-card border-variant="warning" text-variant="dark">
                                      <template v-slot:header>
                                        <h3 class="mb-0">
                                          <span class="ml-0">{{ opportunity.Company }}</span>
                                          <font-awesome-icon fas icon="user-shield" class="icon text-danger float-right ml-1"></font-awesome-icon>
                                          <font-awesome-icon fas icon="folder-open" class="icon text-warning float-right ml-1"></font-awesome-icon>
                                        </h3>
                                      </template>
                                      <b-card-body v-html="opportunity.HTML"></b-card-body>
                                    </b-card>
                                  </div>
                                </div>
                              </div>
                              <div v-else>
                                <!-- NOT PRIVATE -->
                                <div v-if="opportunity.Completed == 'Yes'">
                                  <!-- NOT PRIVATE AND COMPLETED -->
                                  <b-card border-variant="success" text-variant="dark">
                                    <template v-slot:header>
                                      <h3 class="mb-0">
                                        <span class="ml-0">{{ opportunity.Company }}</span>
                                        <font-awesome-icon fas icon="folder" class="icon text-success float-right ml-1"></font-awesome-icon>
                                      </h3>
                                    </template>
                                    <b-card-body v-html="opportunity.HTML"></b-card-body>
                                  </b-card>
                                </div>
                                <div v-else>
                                  <!-- NOT PRIVATE AND NOT COMPLETED -->
                                  <div v-if="isSubcontractor">
                                    <div v-if="opportunity.Company == Company">
                                      <b-card border-variant="warning" text-variant="dark">
                                        <template v-slot:header>
                                          <h3 class="mb-0">
                                            <span class="ml-0">{{ opportunity.Company }}</span>
                                            <font-awesome-icon fas icon="folder-open" class="icon text-warning float-right ml-1"></font-awesome-icon>
                                          </h3>
                                        </template>
                                        <b-card-body v-html="opportunity.HTML"></b-card-body>
                                      </b-card>
                                    </div>
                                  </div>
                                  <div v-else>
                                    <b-card border-variant="warning" text-variant="dark">
                                      <template v-slot:header>
                                        <h3 class="mb-0">
                                          <span class="ml-0">{{ opportunity.Company }}</span>
                                          <font-awesome-icon fas icon="folder-open" class="icon text-warning float-right ml-1"></font-awesome-icon>
                                        </h3>
                                      </template>
                                      <b-card-body v-html="opportunity.HTML"></b-card-body>
                                    </b-card>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </b-tab>
                      </b-tabs>
                    </b-card>
                  </div>
                </b-col>
              </b-row>
            </b-tab>
            <b-tab class="mtab Section6">
              <template slot="title">
                <font-awesome-icon fas icon="truck" class="icon"></font-awesome-icon>
                Deliverables
              </template>
              <b-row>
                <b-col cols="12">
                  <div id="Section6Main" class="rtesection">
                    <b-row class="m-1">
                      <div class="m-1" v-if="!isSubcontractor">
                        <b-dropdown :disabled="isEditing" text="Edit Deliverables" v-if="Deliverables.length > 0" split split-variant="outline-danger" variant="danger">
                          <b-dropdown-item v-for="deliverable in Deliverables" :key="deliverable" @click="handleit('editdeliverable', deliverable.Company, deliverable.Index)">Edit {{ deliverable.Company }} Deliverables</b-dropdown-item>
                        </b-dropdown>
                      </div>
                      <div class="m-1" v-if="isSubcontractor && Deliverables.length > 0">
                        <div v-for="deliverable in Deliverables" :key="deliverable">
                          <b-button :disabled="isEditing" v-if="deliverable.Company == Company && deliverable.Completed == 'No'" class="formbutton" id="btn_Deliverables" ref="btn_Deliverables" variant="outline-danger" @click="handleit('editdeliverable', deliverable.Company, deliverable.Index)">Edit Deliverables</b-button>
                        </div>
                      </div>
                    </b-row>
                    <b-form v-if="DeliverablesForm">
                      <b-row>
                        <ejs-richtexteditor ref="rte_Deliverables" id="rte_Deliverables" height="600" :fontFamily="fontFamily" :cssClass="cssClass" v-model="SelectedDeliverable" :pasteCleanupSettings="pasteCleanupSettings" :toolbarSettings="toolbarSettings"></ejs-richtexteditor>
                      </b-row>
                      <b-row id="DeliverablesAnchor">
                        <b-button id="btn_Clear" ref="btn_Clear" class="formbutton" variant="warning" @click="handleit('cleardeliverable', '', '')">Clear Contents</b-button>
                        <b-button id="btn_CancelDeliverables" ref="btn_CancelDeliverables" class="formbutton" variant="info" @click="handleit('canceldeliverable', '', '')">Cancel</b-button>
                        <b-button id="btn_SaveDeliverables" ref="btn_SaveDeliverables" class="formbutton" variant="success" @click="handleit('savedeliverable', 'Deliverables', 'DeliverablesForm')" title="Save and Edit Later">Save</b-button>
                        <b-button id="btn_PrivateDeliverable" ref="btn_PrivateDeliverable" class="formbutton" variant="primary" title="Ensure that others can't see the input" @click="handleit('privatedeliverable', '', '')">Make Private</b-button>
                        <b-button id="btn_CompleteDeliverable" ref="btn_CompleteDeliverable" class="formbutton ml-auto" variant="success" title="Inputs are complete for this section." @click="handleit('completedeliverable', '', '')">Complete</b-button>
                      </b-row>
                    </b-form>
                    <div v-else id="Deliverables">
                      <div v-for="deliverable in Deliverables" :key="deliverable" class="text-left mb-2">
                        <div v-if="deliverable.Private == 'Yes'">
                          <!-- PRIVATE -->
                          <div v-if="deliverable.Completed == 'Yes'">
                            <!-- PRIVATE AND COMPLETED -->
                            <div v-if="isSubcontractor">
                              <div v-if="deliverable.Company == Company">
                                <!-- SUBCONTRACTOR OF COMPANY CAN SEE THE ITEM WHILE OTHER SUBCONTRACTORS CAN NOT. -->
                                <b-card border-variant="success" text-variant="dark">
                                  <template v-slot:header>
                                    <h3 class="mb-0">
                                      <span class="ml-0">{{ deliverable.Company }}</span>
                                      <font-awesome-icon fas icon="user-shield" class="icon text-danger float-right ml-1"></font-awesome-icon>
                                      <font-awesome-icon fas icon="folder" class="icon text-success float-right ml-1"></font-awesome-icon>
                                    </h3>
                                  </template>
                                  <b-card-body v-html="deliverable.HTML"></b-card-body>
                                </b-card>
                              </div>
                            </div>
                            <div v-else>
                              <b-card border-variant="success" text-variant="dark">
                                <template v-slot:header>
                                  <h3 class="mb-0">
                                    <span class="ml-0">{{ deliverable.Company }}</span>
                                    <font-awesome-icon fas icon="user-shield" class="icon text-danger float-right ml-1"></font-awesome-icon>
                                    <font-awesome-icon fas icon="folder" class="icon text-success float-right ml-1"></font-awesome-icon>
                                  </h3>
                                </template>
                                <b-card-body v-html="deliverable.HTML"></b-card-body>
                              </b-card>
                            </div>
                          </div>
                          <!-- PRIVATE BUT NOT COMPLETED (DENOTED BY 'WARNING COLOR) -->
                          <div v-else>
                            <div v-if="isSubcontractor">
                              <div v-if="deliverable.Company == Company">
                                <!-- SUBCONTRACTOR OF COMPANY CAN SEE THE ITEM WHILE OTHER SUBCONTRACTORS CAN NOT. -->
                                <b-card border-variant="warning" text-variant="dark">
                                  <template v-slot:header>
                                    <h3 class="mb-0">
                                      <span class="ml-0">{{ deliverable.Company }}</span>
                                      <font-awesome-icon fas icon="user-shield" class="icon text-danger float-right ml-1"></font-awesome-icon>
                                      <font-awesome-icon fas icon="folder-open" class="icon text-warning float-right ml-1"></font-awesome-icon>
                                    </h3>
                                  </template>
                                  <b-card-body v-html="deliverable.HTML"></b-card-body>
                                </b-card>
                              </div>
                            </div>
                            <div v-else>
                              <!-- OTHER USERS ABLE TO SEE ITEM. -->
                              <b-card border-variant="warning" text-variant="dark">
                                <template v-slot:header>
                                  <h3 class="mb-0">
                                    <span class="ml-0">{{ deliverable.Company }}</span>
                                    <font-awesome-icon fas icon="user-shield" class="icon text-danger float-right ml-1"></font-awesome-icon>
                                    <font-awesome-icon fas icon="folder-open" class="icon text-warning float-right ml-1"></font-awesome-icon>
                                  </h3>
                                </template>
                                <b-card-body v-html="deliverable.HTML"></b-card-body>
                              </b-card>
                            </div>
                          </div>
                        </div>
                        <div v-else>
                          <!-- NOT PRIVATE -->
                          <div v-if="deliverable.Completed == 'Yes'">
                            <!-- NOT PRIVATE AND COMPLETED -->
                            <b-card border-variant="success" text-variant="dark">
                              <template v-slot:header>
                                <h3 class="mb-0">
                                  <span class="ml-0">{{ deliverable.Company }}</span>
                                  <font-awesome-icon fas icon="folder" class="icon text-success float-right ml-1"></font-awesome-icon>
                                </h3>
                              </template>
                              <b-card-body v-html="deliverable.HTML"></b-card-body>
                            </b-card>
                          </div>
                          <div v-else>
                            <!-- NOT PRIVATE AND NOT COMPLETED -->
                            <div v-if="isSubcontractor">
                              <div v-if="deliverable.Company == Company">
                                <b-card border-variant="warning" text-variant="dark">
                                  <template v-slot:header>
                                    <h3 class="mb-0">
                                      <span class="ml-0">{{ deliverable.Company }}</span>
                                      <font-awesome-icon fas icon="folder-open" class="icon text-warning float-right ml-1"></font-awesome-icon>
                                    </h3>
                                  </template>
                                  <b-card-body v-html="deliverable.HTML"></b-card-body>
                                </b-card>
                              </div>
                            </div>
                            <div v-else>
                              <b-card border-variant="warning" text-variant="dark">
                                <template v-slot:header>
                                  <h3 class="mb-0">
                                    <span class="ml-0">{{ deliverable.Company }}</span>
                                    <font-awesome-icon fas icon="folder-open" class="icon text-warning float-right ml-1"></font-awesome-icon>
                                  </h3>
                                </template>
                                <b-card-body v-html="deliverable.HTML"></b-card-body>
                              </b-card>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </b-col>
              </b-row>
            </b-tab>
            <b-tab :disabled="isSubcontractor" class="mtab Section7">
              <template slot="title">
                <font-awesome-icon fas icon="thumbs-up" class="icon"></font-awesome-icon>
                Distribution
              </template>
              <div class="row">
                <b-col cols="12">
                  <div id="Section7Main" class="rtesection">
                    <b-row class="m-1">
                      <b-button :disabled="isEditing" class="formbutton" id="btn_Distribution" ref="btn_Distribution" variant="outline-danger" @click="handleit('edit', 'Distribution', 'DistributionForm')">Add/Edit Distribution</b-button>
                    </b-row>
                    <b-form v-if="DistributionForm">
                      <b-row>
                        <ejs-richtexteditor ref="rte_Distribution" id="rte_Distribution" height="600" :fontFamily="fontFamily" :cssClass="cssClass" v-model="Distribution" :pasteCleanupSettings="pasteCleanupSettings" :toolbarSettings="toolbarSettings"></ejs-richtexteditor>
                      </b-row>
                      <b-row id="DistributionAnchor">
                        <b-button id="btn_Clear" ref="btn_Clear" class="formbutton" variant="warning" @click="handleit('clear', '', '')">Clear Contents</b-button>
                        <b-button id="btn_CancelDistribution" ref="btn_CancelDistribution" class="formbutton" variant="info" @click="handleit('cancel', 'Distribution', 'DistributionForm')">Cancel</b-button>
                        <b-button id="btn_SaveDistribution" ref="btn_SaveDistribution" class="formbutton ml-auto" variant="success" @click="handleit('save', 'Distribution', 'DistributionForm')" title="Inputs are complete for this section.">Complete</b-button>
                      </b-row>
                    </b-form>
                    <div v-else id="Distribution" v-html="Distribution"></div>
                  </div>
                </b-col>
              </div>
            </b-tab>
            <b-tab class="mtab Summary">
              <template slot="title">
                <font-awesome-icon fas icon="traffic-light" class="icon"></font-awesome-icon>
                Summary
              </template>
              <b-row v-if="!isSubcontractor">
                <b-col cols="12">
                  <div id="Section1" class="rtesection">
                    <h1>
                      1.0 Funding and Staffing Summary
                    </h1>
                    <br />
                    <h2>
                      1.1 Funding
                    </h2>
                    <br />
                    <div id="FundingHtml" v-html="Funding"></div>
                    <br />
                    <h2>
                      1.2 Engineering Effort/Staffing
                    </h2>
                    <br />
                    <div id="StaffingHtml" v-html="Staffing"></div>
                    <br />
                    <h2>
                      1.3 Cost Report
                    </h2>
                    <br />
                    <div id="CostReportHtml" v-html="CostReport"></div>
                  </div>
                </b-col>
              </b-row>
              <b-row v-if="!isSubcontractor">
                <b-col cols="12">
                  <div id="Section2" class="rtesection">
                    <h1>
                      2.0 Travel
                    </h1>
                    <br />
                    <h2>
                      2.1 Travel
                    </h2>
                    <br />
                    <h3>
                      2.1.1 Travel Accomplished
                    </h3>
                    <br />
                    <div id="TravelAccomplishedHtml" v-html="TravelAccomplished"></div>
                    <br />
                    <h3>
                      2.1.2 Travel Planned
                    </h3>
                    <br />
                    <div id="TravelPlannedHtml" v-html="TravelPlanned"></div>
                    <br />
                    <h3>
                      2.1.3 Travel Costs To Date
                    </h3>
                    <br />
                    <div id="TravelCostsHtml" v-html="TravelCosts"></div>
                    <h2>
                      2.2 ODCs
                    </h2>
                    <br />
                    <h3>
                      2.2.1 ODCs Accomplished
                    </h3>
                    <br />
                    <div id="ODCAccomplishedHtml" v-html="ODCAccomplished"></div>
                    <br />
                    <h3>
                      2.2.2 ODCs Planned
                    </h3>
                    <br />
                    <div id="ODCPlannedHtml" v-html="ODCPlanned"></div>
                    <br />
                    <h3>
                      2.2.3 ODC Costs To Date
                    </h3>
                    <br />
                    <div id="ODCCostsHtml" v-html="ODCCosts"></div>
                  </div>
                </b-col>
              </b-row>
              <b-row>
                <b-col cols="12">
                  <div id="Section3Main" class="rtesection">
                    <h1>
                      3.0 Accomplishments
                    </h1>
                    <br />
                    <div id="Accomplishments">
                      <div v-for="accomplishment in Accomplishments" :key="accomplishment" class="text-left mb-2">
                        <div v-if="accomplishment.Private == 'Yes'">
                          <!-- PRIVATE -->
                          <div v-if="accomplishment.Completed == 'Yes'">
                            <!-- PRIVATE AND PUBLISHED -->
                            <div v-if="isSubcontractor">
                              <div v-if="accomplishment.Company == Company">
                                <!-- SUBCONTRACTOR OF COMPANY CAN SEE THE ITEM WHILE OTHER SUBCONTRACTORS CAN NOT. -->
                                <b-card border-variant="success" text-variant="dark">
                                  <template v-slot:header>
                                    <h3 class="mb-0">
                                      <span class="ml-0">{{ accomplishment.Company }}</span>
                                      <font-awesome-icon fas icon="user-shield" class="icon text-danger float-right ml-1"></font-awesome-icon>
                                      <font-awesome-icon fas icon="folder" class="icon text-success float-right ml-1"></font-awesome-icon>
                                    </h3>
                                  </template>
                                  <b-card-body v-html="accomplishment.HTML"></b-card-body>
                                </b-card>
                              </div>
                            </div>
                            <div v-else>
                              <b-card border-variant="success" text-variant="dark">
                                <template v-slot:header>
                                  <h3 class="mb-0">
                                    <span class="ml-0">{{ accomplishment.Company }}</span>
                                    <font-awesome-icon fas icon="user-shield" class="icon text-danger float-right ml-1"></font-awesome-icon>
                                    <font-awesome-icon fas icon="folder" class="icon text-success float-right ml-1"></font-awesome-icon>
                                  </h3>
                                </template>
                                <b-card-body v-html="accomplishment.HTML"></b-card-body>
                              </b-card>
                            </div>
                          </div>
                          <!-- PRIVATE BUT NOT PUBLISHED (DENOTED BY 'WARNING COLOR) -->
                          <div v-else>
                            <div v-if="isSubcontractor">
                              <div v-if="accomplishment.Company == Company">
                                <!-- SUBCONTRACTOR OF COMPANY CAN SEE THE ITEM WHILE OTHER SUBCONTRACTORS CAN NOT. -->
                                <b-card border-variant="warning" text-variant="dark">
                                  <template v-slot:header>
                                    <h3 class="mb-0">
                                      <span class="ml-0">{{ accomplishment.Company }}</span>
                                      <font-awesome-icon fas icon="user-shield" class="icon text-danger float-right ml-1"></font-awesome-icon>
                                      <font-awesome-icon fas icon="folder-open" class="icon text-warning float-right ml-1"></font-awesome-icon>
                                    </h3>
                                  </template>
                                  <b-card-body v-html="accomplishment.HTML"></b-card-body>
                                </b-card>
                              </div>
                            </div>
                            <div v-else>
                              <!-- OTHER USERS ABLE TO SEE ITEM. -->
                              <b-card border-variant="warning" text-variant="dark">
                                <template v-slot:header>
                                  <h3 class="mb-0">
                                    <span class="ml-0">{{ accomplishment.Company }}</span>
                                    <font-awesome-icon fas icon="user-shield" class="icon text-danger float-right ml-1"></font-awesome-icon>
                                    <font-awesome-icon fas icon="folder-open" class="icon text-warning float-right ml-1"></font-awesome-icon>
                                  </h3>
                                </template>
                                <b-card-body v-html="accomplishment.HTML"></b-card-body>
                              </b-card>
                            </div>
                          </div>
                        </div>
                        <div v-else>
                          <!-- NOT PRIVATE -->
                          <div v-if="accomplishment.Completed == 'Yes'">
                            <!-- NOT PRIVATE AND PUBLISHED -->
                            <b-card border-variant="success" text-variant="dark">
                              <template v-slot:header>
                                <h3 class="mb-0">
                                  <span class="ml-0">{{ accomplishment.Company }}</span>
                                  <font-awesome-icon fas icon="folder" class="icon text-success float-right ml-1"></font-awesome-icon>
                                </h3>
                              </template>
                              <b-card-body v-html="accomplishment.HTML"></b-card-body>
                            </b-card>
                          </div>
                          <div v-else>
                            <!-- NOT PRIVATE AND NOT PUBLISHED -->
                            <div v-if="isSubcontractor">
                              <div v-if="accomplishment.Company == Company">
                                <b-card border-variant="warning" text-variant="dark">
                                  <template v-slot:header>
                                    <h3 class="mb-0">
                                      <span class="ml-0">{{ accomplishment.Company }}</span>
                                      <font-awesome-icon fas icon="folder-open" class="icon text-warning float-right ml-1"></font-awesome-icon>
                                    </h3>
                                  </template>
                                  <b-card-body v-html="accomplishment.HTML"></b-card-body>
                                </b-card>
                              </div>
                            </div>
                            <div v-else>
                              <b-card border-variant="warning" text-variant="dark">
                                <template v-slot:header>
                                  <h3 class="mb-0">
                                    <span class="ml-0">{{ accomplishment.Company }}</span>
                                    <font-awesome-icon fas icon="folder-open" class="icon text-warning float-right ml-1"></font-awesome-icon>
                                  </h3>
                                </template>
                                <b-card-body v-html="accomplishment.HTML"></b-card-body>
                              </b-card>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </b-col>
              </b-row>
              <b-row>
                <b-col cols="12">
                  <div id="Section4Main" class="rtesection">
                    <h1>
                      4.0 Plans
                    </h1>
                    <br />
                    <div id="Plans">
                      <div v-for="plan in Plans" :key="plan" class="text-left mb-2">
                        <div v-if="plan.Private == 'Yes'">
                          <!-- PRIVATE -->
                          <div v-if="plan.Completed == 'Yes'">
                            <!-- PRIVATE AND PUBLISHED -->
                            <div v-if="isSubcontractor">
                              <div v-if="plan.Company == Company">
                                <!-- SUBCONTRACTOR OF COMPANY CAN SEE THE ITEM WHILE OTHER SUBCONTRACTORS CAN NOT. -->
                                <b-card border-variant="success" text-variant="dark">
                                  <template v-slot:header>
                                    <h3 class="mb-0">
                                      <span class="ml-0">{{ plan.Company }}</span>
                                      <font-awesome-icon fas icon="user-shield" class="icon text-danger float-right ml-1"></font-awesome-icon>
                                      <font-awesome-icon fas icon="folder" class="icon text-success float-right ml-1"></font-awesome-icon>
                                    </h3>
                                  </template>
                                  <b-card-body v-html="plan.HTML"></b-card-body>
                                </b-card>
                              </div>
                            </div>
                            <div v-else>
                              <b-card border-variant="success" text-variant="dark">
                                <template v-slot:header>
                                  <h3 class="mb-0">
                                    <span class="ml-0">{{ plan.Company }}</span>
                                    <font-awesome-icon fas icon="user-shield" class="icon text-danger float-right ml-1"></font-awesome-icon>
                                    <font-awesome-icon fas icon="folder" class="icon text-success float-right ml-1"></font-awesome-icon>
                                  </h3>
                                </template>
                                <b-card-body v-html="plan.HTML"></b-card-body>
                              </b-card>
                            </div>
                          </div>
                          <!-- PRIVATE BUT NOT PUBLISHED (DENOTED BY 'WARNING COLOR) -->
                          <div v-else>
                            <div v-if="isSubcontractor">
                              <div v-if="plan.Company == Company">
                                <!-- SUBCONTRACTOR OF COMPANY CAN SEE THE ITEM WHILE OTHER SUBCONTRACTORS CAN NOT. -->
                                <b-card border-variant="warning" text-variant="dark">
                                  <template v-slot:header>
                                    <h3 class="mb-0">
                                      <span class="ml-0">{{ plan.Company }}</span>
                                      <font-awesome-icon fas icon="user-shield" class="icon text-danger float-right ml-1"></font-awesome-icon>
                                      <font-awesome-icon fas icon="folder-open" class="icon text-warning float-right ml-1"></font-awesome-icon>
                                    </h3>
                                  </template>
                                  <b-card-body v-html="plan.HTML"></b-card-body>
                                </b-card>
                              </div>
                            </div>
                            <div v-else>
                              <!-- OTHER USERS ABLE TO SEE ITEM. -->
                              <b-card border-variant="warning" text-variant="dark">
                                <template v-slot:header>
                                  <h3 class="mb-0">
                                    <span class="ml-0">{{ plan.Company }}</span>
                                    <font-awesome-icon fas icon="user-shield" class="icon text-danger float-right ml-1"></font-awesome-icon>
                                    <font-awesome-icon fas icon="folder-open" class="icon text-warning float-right ml-1"></font-awesome-icon>
                                  </h3>
                                </template>
                                <b-card-body v-html="plan.HTML"></b-card-body>
                              </b-card>
                            </div>
                          </div>
                        </div>
                        <div v-else>
                          <!-- NOT PRIVATE -->
                          <div v-if="plan.Completed == 'Yes'">
                            <!-- NOT PRIVATE AND PUBLISHED -->
                            <b-card border-variant="success" text-variant="dark">
                              <template v-slot:header>
                                <h3 class="mb-0">
                                  <span class="ml-0">{{ plan.Company }}</span>
                                  <font-awesome-icon fas icon="folder" class="icon text-success float-right ml-1"></font-awesome-icon>
                                </h3>
                              </template>
                              <b-card-body v-html="plan.HTML"></b-card-body>
                            </b-card>
                          </div>
                          <div v-else>
                            <!-- NOT PRIVATE AND NOT PUBLISHED -->
                            <div v-if="isSubcontractor">
                              <div v-if="plan.Company == Company">
                                <b-card border-variant="warning" text-variant="dark">
                                  <template v-slot:header>
                                    <h3 class="mb-0">
                                      <span class="ml-0">{{ plan.Company }}</span>
                                      <font-awesome-icon fas icon="folder-open" class="icon text-warning float-right ml-1"></font-awesome-icon>
                                    </h3>
                                  </template>
                                  <b-card-body v-html="plan.HTML"></b-card-body>
                                </b-card>
                              </div>
                            </div>
                            <div v-else>
                              <b-card border-variant="warning" text-variant="dark">
                                <template v-slot:header>
                                  <h3 class="mb-0">
                                    <span class="ml-0">{{ plan.Company }}</span>
                                    <font-awesome-icon fas icon="folder-open" class="icon text-warning float-right ml-1"></font-awesome-icon>
                                  </h3>
                                </template>
                                <b-card-body v-html="plan.HTML"></b-card-body>
                              </b-card>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </b-col>
              </b-row>
              <b-row>
                <b-col cols="12">
                  <div id="Section5Main" class="rtesection">
                    <h1>
                      5.0 Assumptions / Risks / Opportunities
                    </h1>
                    <br />
                    <h2>
                      Assumptions and Dependencies
                    </h2>
                    <br />
                    <div id="Assumptions">
                      <div v-for="assumption in Assumptions" :key="assumption" class="text-left mb-2">
                        <div v-if="assumption.Private == 'Yes'">
                          <!-- PRIVATE -->
                          <div v-if="assumption.Completed == 'Yes'">
                            <!-- PRIVATE AND PUBLISHED -->
                            <div v-if="isSubcontractor">
                              <div v-if="assumption.Company == Company">
                                <!-- SUBCONTRACTOR OF COMPANY CAN SEE THE ITEM WHILE OTHER SUBCONTRACTORS CAN NOT. -->
                                <b-card border-variant="success" text-variant="dark">
                                  <template v-slot:header>
                                    <h3 class="mb-0">
                                      <span class="ml-0">{{ assumption.Company }}</span>
                                      <font-awesome-icon fas icon="user-shield" class="icon text-danger float-right ml-1"></font-awesome-icon>
                                      <font-awesome-icon fas icon="folder" class="icon text-success float-right ml-1"></font-awesome-icon>
                                    </h3>
                                  </template>
                                  <b-card-body v-html="assumption.HTML"></b-card-body>
                                </b-card>
                              </div>
                            </div>
                            <div v-else>
                              <b-card border-variant="success" text-variant="dark">
                                <template v-slot:header>
                                  <h3 class="mb-0">
                                    <span class="ml-0">{{ assumption.Company }}</span>
                                    <font-awesome-icon fas icon="user-shield" class="icon text-danger float-right ml-1"></font-awesome-icon>
                                    <font-awesome-icon fas icon="folder" class="icon text-success float-right ml-1"></font-awesome-icon>
                                  </h3>
                                </template>
                                <b-card-body v-html="assumption.HTML"></b-card-body>
                              </b-card>
                            </div>
                          </div>
                          <!-- PRIVATE BUT NOT PUBLISHED (DENOTED BY 'WARNING COLOR) -->
                          <div v-else>
                            <div v-if="isSubcontractor">
                              <div v-if="assumption.Company == Company">
                                <!-- SUBCONTRACTOR OF COMPANY CAN SEE THE ITEM WHILE OTHER SUBCONTRACTORS CAN NOT. -->
                                <b-card border-variant="warning" text-variant="dark">
                                  <template v-slot:header>
                                    <h3 class="mb-0">
                                      <span class="ml-0">{{ assumption.Company }}</span>
                                      <font-awesome-icon fas icon="user-shield" class="icon text-danger float-right ml-1"></font-awesome-icon>
                                      <font-awesome-icon fas icon="folder-open" class="icon text-warning float-right ml-1"></font-awesome-icon>
                                    </h3>
                                  </template>
                                  <b-card-body v-html="assumption.HTML"></b-card-body>
                                </b-card>
                              </div>
                            </div>
                            <div v-else>
                              <!-- OTHER USERS ABLE TO SEE ITEM. -->
                              <b-card border-variant="warning" text-variant="dark">
                                <template v-slot:header>
                                  <h3 class="mb-0">
                                    <span class="ml-0">{{ assumption.Company }}</span>
                                    <font-awesome-icon fas icon="user-shield" class="icon text-danger float-right ml-1"></font-awesome-icon>
                                    <font-awesome-icon fas icon="folder-open" class="icon text-warning float-right ml-1"></font-awesome-icon>
                                  </h3>
                                </template>
                                <b-card-body v-html="assumption.HTML"></b-card-body>
                              </b-card>
                            </div>
                          </div>
                        </div>
                        <div v-else>
                          <!-- NOT PRIVATE -->
                          <div v-if="assumption.Completed == 'Yes'">
                            <!-- NOT PRIVATE AND PUBLISHED -->
                            <b-card border-variant="success" text-variant="dark">
                              <template v-slot:header>
                                <h3 class="mb-0">
                                  <span class="ml-0">{{ assumption.Company }}</span>
                                  <font-awesome-icon fas icon="folder" class="icon text-success float-right ml-1"></font-awesome-icon>
                                </h3>
                              </template>
                              <b-card-body v-html="assumption.HTML"></b-card-body>
                            </b-card>
                          </div>
                          <div v-else>
                            <!-- NOT PRIVATE AND NOT PUBLISHED -->
                            <div v-if="isSubcontractor">
                              <div v-if="assumption.Company == Company">
                                <b-card border-variant="warning" text-variant="dark">
                                  <template v-slot:header>
                                    <h3 class="mb-0">
                                      <span class="ml-0">{{ assumption.Company }}</span>
                                      <font-awesome-icon fas icon="folder-open" class="icon text-warning float-right ml-1"></font-awesome-icon>
                                    </h3>
                                  </template>
                                  <b-card-body v-html="assumption.HTML"></b-card-body>
                                </b-card>
                              </div>
                            </div>
                            <div v-else>
                              <b-card border-variant="warning" text-variant="dark">
                                <template v-slot:header>
                                  <h3 class="mb-0">
                                    <span class="ml-0">{{ assumption.Company }}</span>
                                    <font-awesome-icon fas icon="folder-open" class="icon text-warning float-right ml-1"></font-awesome-icon>
                                  </h3>
                                </template>
                                <b-card-body v-html="assumption.HTML"></b-card-body>
                              </b-card>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <br />
                    <h2>
                      Risks and Mitigation
                    </h2>
                    <br />
                    <div id="Risks">
                      <div v-for="risk in Risks" :key="risk" class="text-left mb-2">
                        <div v-if="risk.Private == 'Yes'">
                          <!-- PRIVATE -->
                          <div v-if="risk.Completed == 'Yes'">
                            <!-- PRIVATE AND PUBLISHED -->
                            <div v-if="isSubcontractor">
                              <div v-if="risk.Company == Company">
                                <!-- SUBCONTRACTOR OF COMPANY CAN SEE THE ITEM WHILE OTHER SUBCONTRACTORS CAN NOT. -->
                                <b-card border-variant="success" text-variant="dark">
                                  <template v-slot:header>
                                    <h3 class="mb-0">
                                      <span class="ml-0">{{ risk.Company }}</span>
                                      <font-awesome-icon fas icon="user-shield" class="icon text-danger float-right ml-1"></font-awesome-icon>
                                      <font-awesome-icon fas icon="folder" class="icon text-success float-right ml-1"></font-awesome-icon>
                                    </h3>
                                  </template>
                                  <b-card-body v-html="risk.HTML"></b-card-body>
                                </b-card>
                              </div>
                            </div>
                            <div v-else>
                              <b-card border-variant="success" text-variant="dark">
                                <template v-slot:header>
                                  <h3 class="mb-0">
                                    <span class="ml-0">{{ risk.Company }}</span>
                                    <font-awesome-icon fas icon="user-shield" class="icon text-danger float-right ml-1"></font-awesome-icon>
                                    <font-awesome-icon fas icon="folder" class="icon text-success float-right ml-1"></font-awesome-icon>
                                  </h3>
                                </template>
                                <b-card-body v-html="risk.HTML"></b-card-body>
                              </b-card>
                            </div>
                          </div>
                          <!-- PRIVATE BUT NOT PUBLISHED (DENOTED BY 'WARNING COLOR) -->
                          <div v-else>
                            <div v-if="isSubcontractor">
                              <div v-if="risk.Company == Company">
                                <!-- SUBCONTRACTOR OF COMPANY CAN SEE THE ITEM WHILE OTHER SUBCONTRACTORS CAN NOT. -->
                                <b-card border-variant="warning" text-variant="dark">
                                  <template v-slot:header>
                                    <h3 class="mb-0">
                                      <span class="ml-0">{{ risk.Company }}</span>
                                      <font-awesome-icon fas icon="user-shield" class="icon text-danger float-right ml-1"></font-awesome-icon>
                                      <font-awesome-icon fas icon="folder-open" class="icon text-warning float-right ml-1"></font-awesome-icon>
                                    </h3>
                                  </template>
                                  <b-card-body v-html="risk.HTML"></b-card-body>
                                </b-card>
                              </div>
                            </div>
                            <div v-else>
                              <!-- OTHER USERS ABLE TO SEE ITEM. -->
                              <b-card border-variant="warning" text-variant="dark">
                                <template v-slot:header>
                                  <h3 class="mb-0">
                                    <span class="ml-0">{{ risk.Company }}</span>
                                    <font-awesome-icon fas icon="user-shield" class="icon text-danger float-right ml-1"></font-awesome-icon>
                                    <font-awesome-icon fas icon="folder-open" class="icon text-warning float-right ml-1"></font-awesome-icon>
                                  </h3>
                                </template>
                                <b-card-body v-html="risk.HTML"></b-card-body>
                              </b-card>
                            </div>
                          </div>
                        </div>
                        <div v-else>
                          <!-- NOT PRIVATE -->
                          <div v-if="risk.Completed == 'Yes'">
                            <!-- NOT PRIVATE AND PUBLISHED -->
                            <b-card border-variant="success" text-variant="dark">
                              <template v-slot:header>
                                <h3 class="mb-0">
                                  <span class="ml-0">{{ risk.Company }}</span>
                                  <font-awesome-icon fas icon="folder" class="icon text-success float-right ml-1"></font-awesome-icon>
                                </h3>
                              </template>
                              <b-card-body v-html="risk.HTML"></b-card-body>
                            </b-card>
                          </div>
                          <div v-else>
                            <!-- NOT PRIVATE AND NOT PUBLISHED -->
                            <div v-if="isSubcontractor">
                              <div v-if="risk.Company == Company">
                                <b-card border-variant="warning" text-variant="dark">
                                  <template v-slot:header>
                                    <h3 class="mb-0">
                                      <span class="ml-0">{{ risk.Company }}</span>
                                      <font-awesome-icon fas icon="folder-open" class="icon text-warning float-right ml-1"></font-awesome-icon>
                                    </h3>
                                  </template>
                                  <b-card-body v-html="risk.HTML"></b-card-body>
                                </b-card>
                              </div>
                            </div>
                            <div v-else>
                              <b-card border-variant="warning" text-variant="dark">
                                <template v-slot:header>
                                  <h3 class="mb-0">
                                    <span class="ml-0">{{ risk.Company }}</span>
                                    <font-awesome-icon fas icon="folder-open" class="icon text-warning float-right ml-1"></font-awesome-icon>
                                  </h3>
                                </template>
                                <b-card-body v-html="risk.HTML"></b-card-body>
                              </b-card>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <br />
                    <h2>
                      Opportunities
                    </h2>
                    <br />
                    <div id="Opportunities">
                      <div v-for="opportunity in Opportunities" :key="opportunity" class="text-left mb-2">
                        <div v-if="opportunity.Private == 'Yes'">
                          <!-- PRIVATE -->
                          <div v-if="opportunity.Completed == 'Yes'">
                            <!-- PRIVATE AND PUBLISHED -->
                            <div v-if="isSubcontractor">
                              <div v-if="opportunity.Company == Company">
                                <!-- SUBCONTRACTOR OF COMPANY CAN SEE THE ITEM WHILE OTHER SUBCONTRACTORS CAN NOT. -->
                                <b-card border-variant="success" text-variant="dark">
                                  <template v-slot:header>
                                    <h3 class="mb-0">
                                      <span class="ml-0">{{ opportunity.Company }}</span>
                                      <font-awesome-icon fas icon="user-shield" class="icon text-danger float-right ml-1"></font-awesome-icon>
                                      <font-awesome-icon fas icon="folder" class="icon text-success float-right ml-1"></font-awesome-icon>
                                    </h3>
                                  </template>
                                  <b-card-body v-html="opportunity.HTML"></b-card-body>
                                </b-card>
                              </div>
                            </div>
                            <div v-else>
                              <b-card border-variant="success" text-variant="dark">
                                <template v-slot:header>
                                  <h3 class="mb-0">
                                    <span class="ml-0">{{ opportunity.Company }}</span>
                                    <font-awesome-icon fas icon="user-shield" class="icon text-danger float-right ml-1"></font-awesome-icon>
                                    <font-awesome-icon fas icon="folder" class="icon text-success float-right ml-1"></font-awesome-icon>
                                  </h3>
                                </template>
                                <b-card-body v-html="opportunity.HTML"></b-card-body>
                              </b-card>
                            </div>
                          </div>
                          <!-- PRIVATE BUT NOT PUBLISHED (DENOTED BY 'WARNING COLOR) -->
                          <div v-else>
                            <div v-if="isSubcontractor">
                              <div v-if="opportunity.Company == Company">
                                <!-- SUBCONTRACTOR OF COMPANY CAN SEE THE ITEM WHILE OTHER SUBCONTRACTORS CAN NOT. -->
                                <b-card border-variant="warning" text-variant="dark">
                                  <template v-slot:header>
                                    <h3 class="mb-0">
                                      <span class="ml-0">{{ opportunity.Company }}</span>
                                      <font-awesome-icon fas icon="user-shield" class="icon text-danger float-right ml-1"></font-awesome-icon>
                                      <font-awesome-icon fas icon="folder-open" class="icon text-warning float-right ml-1"></font-awesome-icon>
                                    </h3>
                                  </template>
                                  <b-card-body v-html="opportunity.HTML"></b-card-body>
                                </b-card>
                              </div>
                            </div>
                            <div v-else>
                              <!-- OTHER USERS ABLE TO SEE ITEM. -->
                              <b-card border-variant="warning" text-variant="dark">
                                <template v-slot:header>
                                  <h3 class="mb-0">
                                    <span class="ml-0">{{ opportunity.Company }}</span>
                                    <font-awesome-icon fas icon="user-shield" class="icon text-danger float-right ml-1"></font-awesome-icon>
                                    <font-awesome-icon fas icon="folder-open" class="icon text-warning float-right ml-1"></font-awesome-icon>
                                  </h3>
                                </template>
                                <b-card-body v-html="opportunity.HTML"></b-card-body>
                              </b-card>
                            </div>
                          </div>
                        </div>
                        <div v-else>
                          <!-- NOT PRIVATE -->
                          <div v-if="opportunity.Completed == 'Yes'">
                            <!-- NOT PRIVATE AND PUBLISHED -->
                            <b-card border-variant="success" text-variant="dark">
                              <template v-slot:header>
                                <h3 class="mb-0">
                                  <span class="ml-0">{{ opportunity.Company }}</span>
                                  <font-awesome-icon fas icon="folder" class="icon text-success float-right ml-1"></font-awesome-icon>
                                </h3>
                              </template>
                              <b-card-body v-html="opportunity.HTML"></b-card-body>
                            </b-card>
                          </div>
                          <div v-else>
                            <!-- NOT PRIVATE AND NOT PUBLISHED -->
                            <div v-if="isSubcontractor">
                              <div v-if="opportunity.Company == Company">
                                <b-card border-variant="warning" text-variant="dark">
                                  <template v-slot:header>
                                    <h3 class="mb-0">
                                      <span class="ml-0">{{ opportunity.Company }}</span>
                                      <font-awesome-icon fas icon="folder-open" class="icon text-warning float-right ml-1"></font-awesome-icon>
                                    </h3>
                                  </template>
                                  <b-card-body v-html="opportunity.HTML"></b-card-body>
                                </b-card>
                              </div>
                            </div>
                            <div v-else>
                              <b-card border-variant="warning" text-variant="dark">
                                <template v-slot:header>
                                  <h3 class="mb-0">
                                    <span class="ml-0">{{ opportunity.Company }}</span>
                                    <font-awesome-icon fas icon="folder-open" class="icon text-warning float-right ml-1"></font-awesome-icon>
                                  </h3>
                                </template>
                                <b-card-body v-html="opportunity.HTML"></b-card-body>
                              </b-card>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </b-col>
              </b-row>
              <b-row>
                <b-col cols="12">
                  <div id="Section6Main" class="rtesection">
                    <h1>
                      6.0 Deliverables
                    </h1>
                    <br />
                    <div id="Deliverables">
                      <div v-for="deliverable in Deliverables" :key="deliverable" class="text-left mb-2">
                        <div v-if="deliverable.Private == 'Yes'">
                          <!-- PRIVATE -->
                          <div v-if="deliverable.Completed == 'Yes'">
                            <!-- PRIVATE AND PUBLISHED -->
                            <div v-if="isSubcontractor">
                              <div v-if="deliverable.Company == Company">
                                <!-- SUBCONTRACTOR OF COMPANY CAN SEE THE ITEM WHILE OTHER SUBCONTRACTORS CAN NOT. -->
                                <b-card border-variant="success" text-variant="dark">
                                  <template v-slot:header>
                                    <h3 class="mb-0">
                                      <span class="ml-0">{{ deliverable.Company }}</span>
                                      <font-awesome-icon fas icon="user-shield" class="icon text-danger float-right ml-1"></font-awesome-icon>
                                      <font-awesome-icon fas icon="folder" class="icon text-success float-right ml-1"></font-awesome-icon>
                                    </h3>
                                  </template>
                                  <b-card-body v-html="deliverable.HTML"></b-card-body>
                                </b-card>
                              </div>
                            </div>
                            <div v-else>
                              <b-card border-variant="success" text-variant="dark">
                                <template v-slot:header>
                                  <h3 class="mb-0">
                                    <span class="ml-0">{{ deliverable.Company }}</span>
                                    <font-awesome-icon fas icon="user-shield" class="icon text-danger float-right ml-1"></font-awesome-icon>
                                    <font-awesome-icon fas icon="folder" class="icon text-success float-right ml-1"></font-awesome-icon>
                                  </h3>
                                </template>
                                <b-card-body v-html="deliverable.HTML"></b-card-body>
                              </b-card>
                            </div>
                          </div>
                          <!-- PRIVATE BUT NOT PUBLISHED (DENOTED BY 'WARNING COLOR) -->
                          <div v-else>
                            <div v-if="isSubcontractor">
                              <div v-if="deliverable.Company == Company">
                                <!-- SUBCONTRACTOR OF COMPANY CAN SEE THE ITEM WHILE OTHER SUBCONTRACTORS CAN NOT. -->
                                <b-card border-variant="warning" text-variant="dark">
                                  <template v-slot:header>
                                    <h3 class="mb-0">
                                      <span class="ml-0">{{ deliverable.Company }}</span>
                                      <font-awesome-icon fas icon="user-shield" class="icon text-danger float-right ml-1"></font-awesome-icon>
                                      <font-awesome-icon fas icon="folder-open" class="icon text-warning float-right ml-1"></font-awesome-icon>
                                    </h3>
                                  </template>
                                  <b-card-body v-html="deliverable.HTML"></b-card-body>
                                </b-card>
                              </div>
                            </div>
                            <div v-else>
                              <!-- OTHER USERS ABLE TO SEE ITEM. -->
                              <b-card border-variant="warning" text-variant="dark">
                                <template v-slot:header>
                                  <h3 class="mb-0">
                                    <span class="ml-0">{{ deliverable.Company }}</span>
                                    <font-awesome-icon fas icon="user-shield" class="icon text-danger float-right ml-1"></font-awesome-icon>
                                    <font-awesome-icon fas icon="folder-open" class="icon text-warning float-right ml-1"></font-awesome-icon>
                                  </h3>
                                </template>
                                <b-card-body v-html="deliverable.HTML"></b-card-body>
                              </b-card>
                            </div>
                          </div>
                        </div>
                        <div v-else>
                          <!-- NOT PRIVATE -->
                          <div v-if="deliverable.Completed == 'Yes'">
                            <!-- NOT PRIVATE AND PUBLISHED -->
                            <b-card border-variant="success" text-variant="dark">
                              <template v-slot:header>
                                <h3 class="mb-0">
                                  <span class="ml-0">{{ deliverable.Company }}</span>
                                  <font-awesome-icon fas icon="folder" class="icon text-success float-right ml-1"></font-awesome-icon>
                                </h3>
                              </template>
                              <b-card-body v-html="deliverable.HTML"></b-card-body>
                            </b-card>
                          </div>
                          <div v-else>
                            <!-- NOT PRIVATE AND NOT PUBLISHED -->
                            <div v-if="isSubcontractor">
                              <div v-if="deliverable.Company == Company">
                                <b-card border-variant="warning" text-variant="dark">
                                  <template v-slot:header>
                                    <h3 class="mb-0">
                                      <span class="ml-0">{{ deliverable.Company }}</span>
                                      <font-awesome-icon fas icon="folder-open" class="icon text-warning float-right ml-1"></font-awesome-icon>
                                    </h3>
                                  </template>
                                  <b-card-body v-html="deliverable.HTML"></b-card-body>
                                </b-card>
                              </div>
                            </div>
                            <div v-else>
                              <b-card border-variant="warning" text-variant="dark">
                                <template v-slot:header>
                                  <h3 class="mb-0">
                                    <span class="ml-0">{{ deliverable.Company }}</span>
                                    <font-awesome-icon fas icon="folder-open" class="icon text-warning float-right ml-1"></font-awesome-icon>
                                  </h3>
                                </template>
                                <b-card-body v-html="deliverable.HTML"></b-card-body>
                              </b-card>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </b-col>
              </b-row>
              <b-row>
                <b-col cols="12">
                  <div id="Section7Main" class="rtesection">
                    <h1>
                      7.0 Distribution
                    </h1>
                    <br />
                    <div id="Distribution" v-html="Distribution"></div>
                  </div>
                </b-col>
              </b-row>
            </b-tab>
            <b-tab :disabled="isSubcontractor" class="mtab">
              <template slot="title">
                <font-awesome-icon fas icon="traffic-light" class="icon"></font-awesome-icon>
                Review
              </template>
              <b-row class="buttonrow">
                <b-col cols="4" class="p-0 text-left">
                  <b-form-checkbox v-if="isWPManager || isDeveloper" title="Checking this box will denote that you have completed your review." id="WPMReview" ref="WPMReview" v-model="WPMReview" name="WPMReview" value="Complete" unchecked-value="Pending">
                    WPM Review
                  </b-form-checkbox>
                  <b-form-checkbox v-if="isQA || isDeveloper" title="Checking this box will denote that you have completed your review." id="QAReview" ref="QAReview" v-model="QAReview" name="QAReview" value="Complete" unchecked-value="Pending">
                    QA Review
                  </b-form-checkbox>
                  <b-form-checkbox v-if="isPCA || isDeveloper" title="Checking this box will denote that you have completed your review." id="PCAReview" ref="PCAReview" v-model="PCAReview" name="PCAReview" value="Complete" unchecked-value="Pending">
                    PCA Review
                  </b-form-checkbox>
                </b-col>
              </b-row>
            </b-tab>
            <b-tab :disabled="!isPM" class="mtab">
              <template slot="title">
                <font-awesome-icon fas icon="upload" class="icon"></font-awesome-icon>
                Publish
              </template>
              <b-row class="buttonrow">
                <b-button ref="btnPublish" variant="success" @click="publishMSR">Publish MSR</b-button>
              </b-row>
              <b-row>
                <div id="Publish">
                  <b-row>
                    <b-col cols="12">
                      <div>
                        <h2>
                          1.0 Funding and Staffing Summary
                        </h2>
                        <br />
                        <h3>
                          1.1 Funding
                        </h3>
                        <br />
                        <div id="PublishFunding" v-html="Funding"></div>
                        <br />
                        <h3>
                          1.2 Engineering Effort/Staffing
                        </h3>
                        <br />
                        <div id="PublishStaffing" v-html="Staffing"></div>
                        <br />
                        <h3>
                          1.3 Cost Report
                        </h3>
                        <br />
                        <div id="PublishCostReport" v-html="CostReport"></div>
                      </div>
                    </b-col>
                  </b-row>
                  <b-row>
                    <b-col cols="12">
                      <div>
                        <h2>
                          2.0 Travel
                        </h2>
                        <br />
                        <h3>
                          2.1 Travel
                        </h3>
                        <br />
                        <h4>
                          2.1.1 Travel Accomplished
                        </h4>
                        <br />
                        <div id="PublishTravelAccomplished" v-html="TravelAccomplished"></div>
                        <br />
                        <h4>
                          2.1.2 Travel Planned
                        </h4>
                        <br />
                        <div id="PublishTravelPlanned" v-html="TravelPlanned"></div>
                        <br />
                        <h4>
                          2.1.3 Travel Costs To Date
                        </h4>
                        <br />
                        <div id="PublishTravelCosts" v-html="TravelCosts"></div>
                        <h3>
                          2.2 ODCs
                        </h3>
                        <br />
                        <h4>
                          2.2.1 ODCs Accomplished
                        </h4>
                        <br />
                        <div id="PublishODCAccomplished" v-html="ODCAccomplished"></div>
                        <br />
                        <h4>
                          2.2.2 ODCs Planned
                        </h4>
                        <br />
                        <div id="PublishODCPlanned" v-html="ODCPlanned"></div>
                        <br />
                        <h4>
                          2.2.3 ODC Costs To Date
                        </h4>
                        <br />
                        <div id="PublishODCCosts" v-html="ODCCosts"></div>
                      </div>
                    </b-col>
                  </b-row>
                  <b-row>
                    <b-col cols="12">
                      <div>
                        <h2>
                          3.0 Accomplishments
                        </h2>
                        <br />
                        <div id="PublishAccomplishments" ref="Accomplishments">
                          <div v-for="accomplishment in Accomplishments" :key="accomplishment" class="text-left mb-2">
                            <h4 class="mb-0">
                              <span class="ml-0">{{ accomplishment.Company }}</span>
                            </h4>
                            <div class="ml-1" v-html="accomplishment.HTML"></div>
                          </div>
                        </div>
                      </div>
                    </b-col>
                  </b-row>
                  <b-row>
                    <b-col cols="12">
                      <div>
                        <h2>
                          4.0 Plans
                        </h2>
                        <br />
                        <div id="PublishPlans">
                          <div v-for="plan in Plans" :key="plan" class="text-left mb-2">
                            <h4 class="mb-0">
                              <span class="ml-0">{{ plan.Company }}</span>
                            </h4>
                            <div class="ml-1" v-html="plan.HTML"></div>
                          </div>
                        </div>
                      </div>
                    </b-col>
                  </b-row>
                  <b-row>
                    <b-col cols="12">
                      <div>
                        <h2>
                          5.0 Assumptions / Risks / Opportunities
                        </h2>
                        <br />
                        <h3>
                          Assumptions and Dependencies
                        </h3>
                        <br />
                        <div id="PublishAssumptions">
                          <div v-for="assumption in Assumptions" :key="assumption" class="text-left mb-2">
                            <h4 class="mb-0">
                              <span class="ml-0">{{ assumption.Company }}</span>
                            </h4>
                            <div class="ml-1" v-html="assumption.HTML"></div>
                          </div>
                        </div>
                        <br />
                        <h3>
                          Risks and Mitigation
                        </h3>
                        <br />
                        <div id="PublishRisks">
                          <div v-for="risk in Risks" :key="risk" class="text-left mb-2">
                            <h4 class="mb-0">
                              <span class="ml-0">{{ risk.Company }}</span>
                            </h4>
                            <div class="ml-1" v-html="risk.HTML"></div>
                          </div>
                        </div>
                        <br />
                        <h3>
                          Opportunities
                        </h3>
                        <br />
                        <div id="PublishOpportunities">
                          <div v-for="opportunity in Opportunities" :key="opportunity" class="text-left mb-2">
                            <h4 class="mb-0">
                              <span class="ml-0">{{ opportunity.Company }}</span>
                            </h4>
                            <div class="ml-1" v-html="opportunity.HTML"></div>
                          </div>
                        </div>
                      </div>
                    </b-col>
                  </b-row>
                  <b-row>
                    <b-col cols="12">
                      <div>
                        <h2>
                          6.0 Deliverables
                        </h2>
                        <br />
                        <div id="PublishDeliverables">
                          <div v-for="deliverable in Deliverables" :key="deliverable" class="text-left mb-2">
                            <h4 class="mb-0">
                              <span class="ml-0">{{ deliverable.Company }}</span>
                            </h4>
                            <div class="ml-1" v-html="deliverable.HTML"></div>
                          </div>
                        </div>
                      </div>
                    </b-col>
                  </b-row>
                  <b-row>
                    <b-col cols="12">
                      <div>
                        <h2>
                          7.0 Distribution
                        </h2>
                        <br />
                        <div id="PublishDistribution" v-html="Distribution"></div>
                      </div>
                    </b-col>
                  </b-row>
                </div>
              </b-row>
              <b-row class="buttonrow">
                <b-button ref="btnPublish" variant="success" @click="publishMSR">Publish MSR</b-button>
              </b-row>
            </b-tab>
          </b-tabs>
        </b-card>
      </b-row>
      <b-row class="bg-warning formfooter">
        <b-col cols="4" class="p-0 text-left"></b-col>
        <b-col cols="4" class="p-0 text-center">
          <b-button-group class="mt-1">
            <b-button v-if="dashboardtabs > 0" ref="btnPrev" variant="info" @click="dashboardtabs--">
              <font-awesome-icon fas icon="angle-left" class="icon"></font-awesome-icon>
              Previous
            </b-button>
            <b-button v-if="dashboardtabs < 9" ref="btnNext" variant="info" @click="dashboardtabs++"
              >Next
              <font-awesome-icon fas icon="angle-right" class="icon ml-1"></font-awesome-icon>
            </b-button>
          </b-button-group>
        </b-col>
        <b-col cols="4" class="p-0 text-right">
          <b-button-group class="mt-1">
            <b-button variant="danger" ref="btnCancel" class="mr-2" @click="onFormClose">Close MSR</b-button>
          </b-button-group>
        </b-col>
      </b-row>
    </div>
  </b-container>
</template>

<script>
import { BorderStyle, Packer, Paragraph, Table, TableCell, TableRow, VerticalAlign, WidthType, AlignmentType, PageNumber, TextRun, CreateDocFromHtml } from 'caci-docx/lib'
// import fileSaver from 'file-saver'
import axios from 'axios'
import Workplan from '@/models/WorkPlan' // used to get sub data
import MSR from '@/models/MSR'
import User from '@/models/User'
import { Toolbar, Link, Image, Count, HtmlEditor, QuickToolbar, Table as RTETable } from '@syncfusion/ej2-vue-richtexteditor'

let SPCI = null
if (window._spPageContextInfo) {
  SPCI = window._spPageContextInfo
}

let months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']
let vm = null
let server = SPCI.webAbsoluteUrl
let library = 'MSRImages'

export default {
  name: 'MsrForm',
  props: {
    msrdata: {
      type: Object
    },
    id: {
      type: String
    },
    dashboardtab: {
      type: Number,
      default: 0
    },
    fundingtab: {
      type: Number,
      default: 0
    },
    traveltab: {
      type: Number,
      default: 0
    },
    arotab: {
      type: Number,
      default: 0
    }
  },
  computed: {
    loaded() {
      return MSR.getters('Loaded')
    },
    msrloaded() {
      return MSR.getters('MSRLoaded')
    },
    msr() {
      return MSR.getters('MSR')
    },
    user() {
      return User.getters('CurrentUser')
    },
    userid() {
      return User.getters('CurrentUserId')
    },
    appversion() {
      return User.getters('AppVersion')
    },
    isDeveloper() {
      return User.getters('isDeveloper')
    },
    isPM() {
      return User.getters('isPM')
    },
    isWPManager() {
      return User.getters('isWPManager')
    },
    isPCA() {
      return User.getters('isPCA')
    },
    isQA() {
      return User.getters('isQA')
    },
    isSubcontractor() {
      return User.getters('isSubcontractor')
    },
    subs() {
      return Workplan.getters('Subs')
    },
    subsloaded() {
      return Workplan.getters('SubsLoaded')
    },
    allworkplans() {
      return Workplan.getters('allWorkplans')
    },
    rect() {
      return this.$store.state.support.contentrect
    }
  },
  errorCaptured(err, vm, info) {
    const notification = {
      type: 'danger',
      title: 'Error in MSR Form ' + err,
      message: info,
      push: true
    }
    this.$store.dispatch('notification/add', notification, {
      root: true
    })
  },
  data: function() {
    return {
      busyTitle: 'Getting Data. Please Wait.',
      isDirty: false,
      headerText: '',
      WordDocument: null,
      fileDigest: null,
      fileBuffer: null,
      fileBlob: null,
      fileType: '',
      fileContent: null,
      fileName: null,
      hasImage: false,
      isEditing: false,
      clipBoard: null,
      ActiveSection: '',
      changecount: 0,
      dashboardtabs: 0,
      fundingtabs: 0,
      traveltabs: 0,
      arotabs: 0,
      POPStart: null,
      POPEnd: null,
      fontFamily: {
        default: 'Calibri',
        items: [
          {
            text: 'Calibri',
            value: 'Calibri',
            class: 'e-calibri-ui',
            command: 'Font',
            subCommand: 'FontName'
          }
        ]
      },
      cssClass: 'defaultcalibri',
      pasteCleanupSettings: {
        keepFormat: true
      },
      toolbarSettings: {
        items: ['Bold', 'Italic', 'Underline', 'StrikeThrough', 'FontName', 'FontSize', 'FontColor', 'BackgroundColor', 'LowerCase', 'UpperCase', '|', 'Formats', 'Alignments', 'UnorderedList', 'Outdent', 'Indent', '|', 'CreateTable', 'CreateLink', '|', 'ClearFormat', 'Print', '|', 'Undo', 'Redo']
      },
      FundingForm: false /* ---------------------------------- used for showing/hiding the form based on the current user permission   */,
      StaffingForm: false /* --------------------------------- used for showing/hiding the form based on the current user permission   */,
      CostReportForm: false /* ------------------------------- used for showing/hiding the form based on the current user permission   */,
      TravelAccomplishedForm: false /* ----------------------- used for showing/hiding the form based on the current user permission   */,
      TravelPlannedForm: false /* ---------------------------- used for showing/hiding the form based on the current user permission   */,
      TravelCostsForm: false /* ------------------------------ used for showing/hiding the form based on the current user permission   */,
      ODCAccomplishedForm: false /* -------------------------- used for showing/hiding the form based on the current user permission   */,
      ODCPlannedForm: false /* ------------------------------- used for showing/hiding the form based on the current user permission   */,
      ODCCostsForm: false /* --------------------------------- used for showing/hiding the form based on the current user permission   */,
      AccomplishmentsForm: false /* -------------------------- used for showing/hiding the form based on the current user permission   */,
      PlansForm: false /* ------------------------------------ used for showing/hiding the form based on the current user permission   */,
      AssumptionsForm: false /* ------------------------------ used for showing/hiding the form based on the current user permission   */,
      RisksForm: false /* ------------------------------------ used for showing/hiding the form based on the current user permission   */,
      OpportunitiesForm: false /* ---------------------------- used for showing/hiding the form based on the current user permission   */,
      DeliverablesForm: false /* ----------------------------- used for showing/hiding the form based on the current user permission   */,
      DistributionForm: false /* ----------------------------- used for showing/hiding the form based on the current user permission   */,
      message: '',
      messagevariant: 'success',
      WorkplanNumber: '',
      WorkplanTitle: '',
      PCAReview: false,
      QAReview: false,
      WPMReview: false,
      Month: '',
      Year: '2020',
      Company: '',
      Email: '',
      Funding: '',
      Staffing: '',
      CostReport: '',
      TravelPlanned: '',
      TravelAccomplished: '',
      TravelCosts: '',
      ODCsAccomplished: '',
      ODCsCostReport: '',
      Accomplishments: [],
      SelectedAccomplishment: '',
      Plans: [],
      SelectedPlan: '',
      Assumptions: [],
      SelectedAssumption: '',
      Risks: [],
      SelectedRisk: '',
      Opportunities: [],
      SelectedOpportunity: '',
      Deliverables: [],
      SelectedDeliverable: '',
      Distribution: '',
      SelectedIndex: 0,
      acompanies: [],
      pcompanies: [],
      legenditems: [
        {
          id: 0,
          type: 'alert',
          name: 'Completed',
          variant: 'white',
          classes: 'text-dark',
          hasIcon: true,
          iconVariant: 'success',
          library: 'fas',
          icon: 'folder'
        },
        {
          id: 1,
          type: 'alert',
          name: 'Not Completed',
          variant: 'white',
          classes: 'text-dark',
          hasIcon: true,
          iconVariant: 'warning',
          library: 'fas',
          icon: 'folder'
        },
        {
          id: 2,
          type: 'alert',
          name: 'Private',
          variant: 'white',
          classes: 'text-dark',
          hasIcon: true,
          iconVariant: 'danger',
          library: 'fas',
          icon: 'user-shield'
        }
      ],
      isNew: false
    }
  },
  mounted: function() {
    vm = this
    this.$bvToast.show('form-toast')
    this.WorkplanTitle = this.msrdata.WorkplanTitle
    this.WorkplanNumber = this.msrdata.WorkplanNumber
    this.Email = this.user[0].Email
    this.Company = this.user[0].Company
    let m = this.$moment().get('month')
    this.Month = months[m]
    this.Year = String(this.$moment().year())
    this.headerText = 'Edit Data For MSR ' + this.msrdata.WorkplanNumber + ' ' + this.msrdata.WorkplanTitle
    let formbody = document.getElementById('Tabs')
    let h = this.rect.height - 100
    formbody.style.height = h + 'px'
    this.dashboardtabs = this.dashboardtab
    this.fundingtabs = this.fundingtab
    this.traveltabs = this.traveltab
    this.arotabs = this.arotab
    MSR.dispatch('getDigest')
    Workplan.dispatch('getSubs', this.WorkplanNumber).then(function() {
      vm.getData()
    })
  },
  beforeDestroy() {
    this.$store.dispatch('support/setLegendItems', [])
    // this.onFormClose()
  },
  methods: {
    getFormDigest() {
      return axios.request({
        url: SPCI.webServerRelativeUrl + '/_api/contextinfo',
        method: 'post',
        headers: {
          Accept: 'application/json; odata=verbose'
        }
      })
    },
    getData: function() {
      if (console) {
        console.log('MSRFORM GETDATA')
      }
      MSR.dispatch('getMSR', this.msrdata).then(function() {
        vm.$store.dispatch('support/addActivity', '<div class="bg-primary">msrform-getMSR: ' + vm.$moment().format() + '</div>')
        vm.waitForMSR()
      })
    },
    waitForMSR: function() {
      if (this.msrloaded) {
        this.WorkplanTitle = this.msr.WorkplanTitle
        this.WorkplanNumber = this.msr.WorkplanNumber
        this.WPMReview = this.msr.WPMReview
        this.PCAReview = this.msr.PCAReview
        this.QAReview = this.msr.QAReview
        this.Funding = this.msr.Funding
        this.Staffing = this.msr.Staffing
        this.CostReport = this.msr.CostReport
        this.TravelAccomplished = this.msr.TravelAccomplished
        this.TravelPlanned = this.msr.TravelPlanned
        this.TravelCosts = this.msr.TravelCosts
        this.ODCAccomplished = this.msr.ODCAccomplished
        this.ODCPlanned = this.msr.ODCPlanned
        this.ODCCosts = this.msr.ODCCosts
        this.Distribution = this.msr.Distribution
        this.Accomplishments = this.formatData2('Accomplishments', this.msr.Accomplishments)
        this.Plans = this.formatData2('Plans', this.msr.Plans)
        this.Assumptions = this.formatData2('Assumptions', this.msr.Assumptions)
        this.Risks = this.formatData2('Risks', this.msr.Risks)
        this.Opportunities = this.formatData2('Opportunities', this.msr.Opportunities)
        this.Deliverables = this.formatData2('Deliverables', this.msr.Deliverables)
        this.isDirty = false
        this.$bvToast.hide('form-toast')
        this.$store.dispatch('support/setLegendItems', this.legenditems)
      } else {
        this.waitForMSR()
      }
    },
    saveReminder: function() {
      this.$bvModal.msgBoxOk('Please Save Your Edits By Clicking the Complete Button. The Form Will Reload So You Can Continue.', {
        title: 'Save and Continue.',
        size: 'md',
        buttonSize: 'sm',
        okVariant: 'success',
        footerClass: 'p-2',
        hideHeaderClose: false,
        centered: true
      })
    },
    getFormStatus: function() {
      // Function to test if form should be closed if the user has not made changes in a specific time period.
      // called by vue-cron
      // Check if form is dirty and reset time if it is. This will keep form open. If not dirty the form should close and call the close method.
      // Another timer is set to warn the user so that they can have a chance to continue
      if (this.isDirty) {
        this.$cron.restart('getFormStatus')
      } else {
        this.$cron.start('closeForm')
        this.$bvModal
          .msgBoxConfirm('Continue Editing MSR?', {
            title: 'Please Confirm or MSR will Close in 2 minutes.',
            size: 'sm',
            buttonSize: 'sm',
            okVariant: 'success',
            okTitle: 'YES',
            cancelTitle: 'NO',
            footerClass: 'p-2',
            hideHeaderClose: false,
            centered: true,
            noCloseOnBackdrop: true
          })
          .then(value => {
            if (value == true) {
              this.$cron.restart('getFormStatus')
              this.$cron.stop('closeForm')
            } else {
              this.onFormClose()
            }
          })
      }
    },
    closeForm: function() {
      this.onFormClose()
    },
    onFormClose: function() {
      let payload = {}
      payload.field = 'Locked'
      payload.value = 'No'
      payload.uri = this.msr.uri
      payload.etag = this.msr.etag
      MSR.dispatch('updateMSRData', payload).then(function() {
        vm.$router.push({ path: '/msr/home' })
      })
    },
    async handleit(action, field, form) {
      // can we pass attributes to show, hide, and save any content?
      switch (action) {
        /* #region BASE */

        case 'edit': {
          this.isDirty = true
          this.isEditing = true
          this.ActiveSection = field
          this.clipBoard = this[field]
          this[form] = true
          this.$nextTick(function() {
            let anchor = field + 'Anchor'
            try {
              let element = document.getElementById(anchor)
              element.scrollIntoView()
            } catch (err) {
              // TODO: Anything?
            }
          })
          break
        }

        case 'cancel': {
          this.hasImage = false
          this.isEditing = false
          this[form] = false
          this[this.ActiveSection] = this.clipBoard
          break
        }

        case 'clear': {
          this.hasImage = false
          this[this.ActiveSection] = ''
          break
        }

        case 'save': {
          // Check to see if there was an image copied and if so, upload that to SharePoint and modify the content to reflect the image change
          vm.busyTitle = 'Saving To SharePoint'
          vm.$bvToast.show('form-toast')
          if (this.hasImage) {
            let response = await this.getFormDigest()
            this.fileDigest = response.data.d.GetContextWebInformation.FormDigestValue
            let blob = await axios({
              url: this.fileBlob,
              method: 'get',
              responseType: 'blob'
            })
            this.fileBuffer = await this.getFileBuffer(blob.data)
            response = await this.uploadMSRImage(this.fileName, this.fileBuffer, this.fileDigest)
            console.log('FILE UPLOADED: ' + response)
            let content = String(this.fileContent)
            blob = String(this.fileBlob)
            let imageurl = server + '/MSRImages/' + this.fileName
            content = content.replace(blob, imageurl)
            this[this.ActiveSection] = content
          }
          let payload = {}
          payload.field = field
          payload.value = this[field]
          payload.uri = this.msr.uri
          payload.etag = this.msr.etag
          this[form] = false
          MSR.dispatch('updateMSRData', payload).then(function() {
            // close the toast notification and wait for the changes
            vm.isEditing = false
            vm.hasImage = false
            vm.ActiveSection = null
            vm.clipBoard = ''
            vm.$bvToast.hide('form-toast')
            // refresh by changing the route
            vm.$router.push({ name: 'Refresh', params: { action: 'msrform', id: vm.id, msrdata: vm.msrdata, dashboardtab: vm.dashboardtabs, fundingtab: vm.fundingtabs, traveltab: vm.traveltabs, arotab: vm.arotabs } })
          })
          break
        }

        /* #endregion */

        /* #region ACCOMPLISHMENTS */

        case 'editaccomplishment': {
          // using field and form for company and index
          this.isDirty = true
          if (console) {
            console.log('EDIT ACCOMPLISHMENT FOR: ' + field + ', ' + form)
          }
          let index = form // more readable. form in this case contains the index of the array item
          this.isEditing = true
          this.AccomplishmentsForm = true
          for (let i = 0; i < this.Accomplishments.length; i++) {
            if (this.Accomplishments[i]['Index'] == index) {
              this.SelectedIndex = i
              this.SelectedAccomplishment = this.Accomplishments[i].HTML
              this.clipBoard = this.Accomplishments[i].HTML
            }
          }
          break
        }

        case 'cancelaccomplishment': {
          // TODO: Validate that this function is needed/ does what it should do
          this.isEditing = false
          this.AccomplishmentsForm = false
          this.SelectedAccomplishment = this.clipBoard
          this.Accomplishments[this.SelectedIndex]['HTML'] = this.clipBoard
          break
        }

        case 'clearaccomplishment': {
          this.SelectedAccomplishment = ''
          this.Accomplishments[this.SelectedIndex]['HTML'] = ''
          break
        }

        case 'privateaccomplishment': {
          // toggle the state of private
          let priv = this.Accomplishments[this.SelectedIndex]['Private']
          if (priv == 'Yes') {
            priv = 'No'
            this.$refs['btn_PrivateAccomplishment'].innerHTML = 'Make Private'
          } else {
            priv = 'Yes'
            this.$refs['btn_PrivateAccomplishment'].innerHTML = 'Remove Private'
          }
          this.Accomplishments[this.SelectedIndex]['Private'] = priv
          break
        }

        case 'completeaccomplishment': {
          // toggle the state of completed
          let comp = this.Accomplishments[this.SelectedIndex]['Completed']
          if (comp == 'Yes') {
            comp = 'No'
          } else {
            comp = 'Yes'
          }
          this.Accomplishments[this.SelectedIndex]['Completed'] = comp
          this.handleit('saveaccomplishment', 'Accomplishments', 'AccomplishmentsForm')
          break
        }

        case 'saveaccomplishment': {
          this.busyTitle = 'Saving To SharePoint'
          this.$bvToast.show('form-toast')
          // update the existing HTML for the index and then save entire array
          this.Accomplishments[this.SelectedIndex].HTML = this.SelectedAccomplishment
          let payload = {}
          payload.field = field
          // value is entire array of json objects that need to be stringified to store
          for (let i = 0; i < this.Accomplishments.length; i++) {
            this.Accomplishments[i].HTML = encodeURIComponent(this.Accomplishments[i].HTML)
          }
          payload.value = JSON.stringify(this.Accomplishments)
          payload.uri = this.msr.uri
          payload.etag = this.msr.etag
          this[form] = false
          MSR.dispatch('updateMSRData', payload).then(function() {
            vm.isEditing = false
            vm.hasImage = false
            vm.clipBoard = ''
            // refresh by changing the route
            vm.$router.push({ name: 'Refresh', params: { action: 'msrform', id: vm.id, msrdata: vm.msrdata, dashboardtab: vm.dashboardtabs, fundingtab: vm.fundingtabs, traveltab: vm.traveltabs, arotab: vm.arotabs } })
          })
          break
        }

        /* #endregion */

        /* #region PLANS */

        case 'editplan': {
          // using field and form for company and index
          this.isDirty = true
          let index = form // more readable. form in this case contains the index of the array item
          this.isEditing = true
          this.PlansForm = true
          for (let i = 0; i < this.Plans.length; i++) {
            if (this.Plans[i]['Index'] == index) {
              this.SelectedIndex = i
              this.SelectedPlan = this.Plans[i].HTML
              this.clipBoard = this.Plans[i].HTML
            }
          }
          break
        }

        case 'cancelplan': {
          this.isEditing = false
          this.PlansForm = false
          this.SelectedPlan = this.clipBoard
          this.Plans[this.SelectedIndex]['HTML'] = this.clipBoard
          break
        }

        case 'clearplan': {
          this.SelectedPlan = ''
          this.Plans[this.SelectedIndex]['HTML'] = ''
          break
        }

        case 'privateplan': {
          // toggle the state of private
          let priv = this.Plans[this.SelectedIndex]['Private']
          if (priv == 'Yes') {
            priv = 'No'
            this.$refs['btn_PrivatePlan'].innerHTML = 'Make Private'
          } else {
            priv = 'Yes'
            this.$refs['btn_PrivatePlan'].innerHTML = 'Remove Private'
          }
          this.Plans[this.SelectedIndex]['Private'] = priv
          break
        }

        case 'completeplan': {
          let comp = this.Plans[this.SelectedIndex]['Completed']
          if (comp == 'Yes') {
            comp = 'No'
          } else {
            comp = 'Yes'
          }
          this.Plans[this.SelectedIndex]['Completed'] = comp
          this.handleit('saveplan', 'Plans', 'PlansForm')
          break
        }

        case 'saveplan': {
          vm.busyTitle = 'Saving To SharePoint'
          vm.$bvToast.show('form-toast')
          this.Plans[this.SelectedIndex].HTML = this.SelectedPlan
          let payload = {}
          payload.field = field
          for (let i = 0; i < this.Plans.length; i++) {
            this.Plans[i].HTML = encodeURIComponent(this.Plans[i].HTML)
          }
          payload.value = JSON.stringify(this.Plans)
          payload.uri = this.msr.uri
          payload.etag = this.msr.etag
          this[form] = false
          MSR.dispatch('updateMSRData', payload).then(function() {
            vm.isEditing = false
            vm.hasImage = false
            vm.clipBoard = ''
            // refresh by changing the route
            vm.$router.push({ name: 'Refresh', params: { action: 'msrform', id: vm.id, msrdata: vm.msrdata, dashboardtab: vm.dashboardtabs, fundingtab: vm.fundingtabs, traveltab: vm.traveltabs, arotab: vm.arotabs } })
          })
          break
        }

        /* #endregion */

        /* #region Assumptions */

        case 'editassumption': {
          // using field and form for company and index
          this.isDirty = true
          let index = form // more readable. form in this case contains the index of the array item
          this.isEditing = true
          this.AssumptionsForm = true
          for (let i = 0; i < this.Assumptions.length; i++) {
            if (this.Assumptions[i]['Index'] == index) {
              this.SelectedIndex = i
              this.SelectedAssumption = this.Assumptions[i].HTML
              this.clipBoard = this.Assumptions[i].HTML
            }
          }
          break
        }

        case 'cancelassumption': {
          this.isEditing = false
          this.AssumptionsForm = false
          this.SelectedAssumption = this.clipBoard
          this.Assumptions[this.SelectedIndex]['HTML'] = this.clipBoard
          break
        }

        case 'clearassumption': {
          this.SelectedAssumption = ''
          this.Assumptions[this.SelectedIndex]['HTML'] = ''
          break
        }

        case 'privateassumption': {
          // toggle the state of private
          let priv = this.Assumptions[this.SelectedIndex]['Private']
          if (priv == 'Yes') {
            priv = 'No'
            this.$refs['btn_PrivateAssumption'].innerHTML = 'Make Private'
          } else {
            priv = 'Yes'
            this.$refs['btn_PrivateAssumption'].innerHTML = 'Remove Private'
          }
          this.Assumptions[this.SelectedIndex]['Private'] = priv
          break
        }

        case 'completeassumption': {
          let comp = this.Assumptions[this.SelectedIndex]['Completed']
          if (comp == 'Yes') {
            comp = 'No'
          } else {
            comp = 'Yes'
          }
          this.Assumptions[this.SelectedIndex]['Completed'] = comp
          this.handleit('saveassumption', 'Assumptions', 'AssumptionsForm')
          break
        }

        case 'saveassumption': {
          vm.busyTitle = 'Saving To SharePoint'
          vm.$bvToast.show('form-toast')
          this.Assumptions[this.SelectedIndex].HTML = this.SelectedAssumption
          let payload = {}
          payload.field = field
          for (let i = 0; i < this.Assumptions.length; i++) {
            this.Assumptions[i].HTML = encodeURIComponent(this.Assumptions[i].HTML)
          }
          payload.value = JSON.stringify(this.Assumptions)
          payload.uri = this.msr.uri
          payload.etag = this.msr.etag
          this[form] = false
          MSR.dispatch('updateMSRData', payload).then(function() {
            vm.isEditing = false
            vm.hasImage = false
            vm.clipBoard = ''
            // refresh by changing the route
            vm.$router.push({ name: 'Refresh', params: { action: 'msrform', id: vm.id, msrdata: vm.msrdata, dashboardtab: vm.dashboardtabs, fundingtab: vm.fundingtabs, traveltab: vm.traveltabs, arotab: vm.arotabs } })
          })
          break
        }

        /* #endregion */

        /* #region RISKS */

        case 'editrisk': {
          // using field and form for company and index
          this.isDirty = true
          let index = form // more readable. form in this case contains the index of the array item
          this.isEditing = true
          this.RisksForm = true
          for (let i = 0; i < this.Risks.length; i++) {
            if (this.Risks[i]['Index'] == index) {
              this.SelectedIndex = i
              this.SelectedRisk = this.Risks[i].HTML
              this.clipBoard = this.Risks[i].HTML
            }
          }
          break
        }

        case 'cancelrisk': {
          this.isEditing = false
          this.RisksForm = false
          this.SelectedRisk = this.clipBoard
          this.Risks[this.SelectedIndex]['HTML'] = this.clipBoard
          break
        }

        case 'clearrisk': {
          this.SelectedRisk = ''
          this.Risks[this.SelectedIndex]['HTML'] = ''
          break
        }

        case 'privaterisk': {
          // toggle the state of private
          let priv = this.Risks[this.SelectedIndex]['Private']
          if (priv == 'Yes') {
            priv = 'No'
            this.$refs['btn_PrivateRisk'].innerHTML = 'Make Private'
          } else {
            priv = 'Yes'
            this.$refs['btn_PrivateRisk'].innerHTML = 'Remove Private'
          }
          this.Risks[this.SelectedIndex]['Private'] = priv
          break
        }

        case 'completerisk': {
          let comp = this.Risks[this.SelectedIndex]['Completed']
          if (comp == 'Yes') {
            comp = 'No'
          } else {
            comp = 'Yes'
          }
          this.Risks[this.SelectedIndex]['Completed'] = comp
          this.handleit('saverisk', 'Risks', 'RisksForm')
          break
        }

        case 'saverisk': {
          vm.busyTitle = 'Saving To SharePoint'
          vm.$bvToast.show('form-toast')
          this.Risks[this.SelectedIndex].HTML = this.SelectedRisk
          let payload = {}
          payload.field = field
          for (let i = 0; i < this.Risks.length; i++) {
            this.Risks[i].HTML = encodeURIComponent(this.Risks[i].HTML)
          }
          payload.value = JSON.stringify(this.Risks)
          payload.uri = this.msr.uri
          payload.etag = this.msr.etag
          this[form] = false
          MSR.dispatch('updateMSRData', payload).then(function() {
            vm.isEditing = false
            vm.hasImage = false
            vm.clipBoard = ''
            // refresh by changing the route
            vm.$router.push({ name: 'Refresh', params: { action: 'msrform', id: vm.id, msrdata: vm.msrdata, dashboardtab: vm.dashboardtabs, fundingtab: vm.fundingtabs, traveltab: vm.traveltabs, arotab: vm.arotabs } })
          })
          break
        }

        /* #endregion */

        /* #region OPPORTUNITIES */

        case 'editopportunity': {
          // using field and form for company and index
          this.isDirty = true
          let index = form // more readable. form in this case contains the index of the array item
          this.isEditing = true
          this.OpportunitiesForm = true
          for (let i = 0; i < this.Opportunities.length; i++) {
            if (this.Opportunities[i]['Index'] == index) {
              this.SelectedIndex = i
              this.SelectedOpportunity = this.Opportunities[i].HTML
              this.clipBoard = this.Opportunities[i].HTML
            }
          }
          break
        }

        case 'cancelopportunity': {
          this.isEditing = false
          this.OpportunitiesForm = false
          this.SelectedOpportunity = this.clipBoard
          this.Opportunities[this.SelectedIndex]['HTML'] = this.clipBoard
          break
        }

        case 'clearopportunity': {
          this.SelectedOpportunity = ''
          this.Opportunities[this.SelectedIndex]['HTML'] = ''
          break
        }

        case 'privateopportunity': {
          // toggle the state of private
          let priv = this.Opportunities[this.SelectedIndex]['Private']
          if (priv == 'Yes') {
            priv = 'No'
            this.$refs['btn_PrivateOpportunity'].innerHTML = 'Make Private'
          } else {
            priv = 'Yes'
            this.$refs['btn_PrivateOpportunity'].innerHTML = 'Remove Private'
          }
          this.Opportunities[this.SelectedIndex]['Private'] = priv
          break
        }

        case 'completeopportunity': {
          let comp = this.Opportunities[this.SelectedIndex]['Completed']
          if (comp == 'Yes') {
            comp = 'No'
          } else {
            comp = 'Yes'
          }
          this.Opportunities[this.SelectedIndex]['Completed'] = comp
          this.handleit('saveopportunity', 'Opportunities', 'OpportunitiesForm')
          break
        }

        case 'saveopportunity': {
          vm.busyTitle = 'Saving To SharePoint'
          vm.$bvToast.show('form-toast')
          this.Opportunities[this.SelectedIndex].HTML = this.SelectedOpportunity
          let payload = {}
          payload.field = field
          for (let i = 0; i < this.Opportunities.length; i++) {
            this.Opportunities[i].HTML = encodeURIComponent(this.Opportunities[i].HTML)
          }
          payload.value = JSON.stringify(this.Opportunities)
          payload.uri = this.msr.uri
          payload.etag = this.msr.etag
          this[form] = false
          MSR.dispatch('updateMSRData', payload).then(function() {
            vm.isEditing = false
            vm.hasImage = false
            vm.clipBoard = ''
            // refresh by changing the route
            vm.$router.push({ name: 'Refresh', params: { action: 'msrform', id: vm.id, msrdata: vm.msrdata, dashboardtab: vm.dashboardtabs, fundingtab: vm.fundingtabs, traveltab: vm.traveltabs, arotab: vm.arotabs } })
          })
          break
        }

        /* #endregion */

        /* #region DELIVERABLES */

        case 'editdeliverable': {
          // using field and form for company and index
          this.isDirty = true
          let index = form // more readable. form in this case contains the index of the array item
          this.isEditing = true
          this.DeliverablesForm = true
          for (let i = 0; i < this.Deliverables.length; i++) {
            if (this.Deliverables[i]['Index'] == index) {
              this.SelectedIndex = i
              this.SelectedDeliverable = this.Deliverables[i].HTML
              this.clipBoard = this.Deliverables[i].HTML
            }
          }
          break
        }

        case 'canceldeliverable': {
          this.isEditing = false
          this.DeliverablesForm = false
          this.SelectedDeliverable = this.clipBoard
          this.Deliverables[this.SelectedIndex]['HTML'] = this.clipBoard
          break
        }

        case 'cleardeliverable': {
          this.SelectedDeliverable = ''
          this.Deliverables[this.SelectedIndex]['HTML'] = ''
          break
        }

        case 'privatedeliverable': {
          // toggle the state of private
          let priv = this.Deliverables[this.SelectedIndex]['Private']
          if (priv == 'Yes') {
            priv = 'No'
            this.$refs['btn_PrivateDeliverable'].innerHTML = 'Make Private'
          } else {
            priv = 'Yes'
            this.$refs['btn_PrivateDeliverable'].innerHTML = 'Remove Private'
          }
          this.Deliverables[this.SelectedIndex]['Private'] = priv
          break
        }

        case 'completedeliverable': {
          let comp = this.Deliverables[this.SelectedIndex]['Completed']
          if (comp == 'Yes') {
            comp = 'No'
          } else {
            comp = 'Yes'
          }
          this.Deliverables[this.SelectedIndex]['Completed'] = comp
          this.handleit('savedeliverable', 'Deliverables', 'DeliverablesForm')
          break
        }

        case 'savedeliverable': {
          vm.busyTitle = 'Saving To SharePoint'
          vm.$bvToast.show('form-toast')
          this.Deliverables[this.SelectedIndex].HTML = this.SelectedDeliverable
          let payload = {}
          payload.field = field
          for (let i = 0; i < this.Deliverables.length; i++) {
            this.Deliverables[i].HTML = encodeURIComponent(this.Deliverables[i].HTML)
          }
          payload.value = JSON.stringify(this.Deliverables)
          payload.uri = this.msr.uri
          payload.etag = this.msr.etag
          this[form] = false
          MSR.dispatch('updateMSRData', payload).then(function() {
            vm.isEditing = false
            vm.hasImage = false
            vm.clipBoard = ''
            // refresh by changing the route
            vm.$router.push({ name: 'Refresh', params: { action: 'msrform', id: vm.id, msrdata: vm.msrdata, dashboardtab: vm.dashboardtabs, fundingtab: vm.fundingtabs, traveltab: vm.traveltabs, arotab: vm.arotabs } })
          })
          break
        }
        /* #endregion */
      }
    },
    onRTEChanged: function(args) {
      console.log('RTECHANGED: ' + args)
      let content = String(args.value)
      vm.fileName = vm.ActiveSection + '_' + vm.WorkplanNumber + '_' + vm.msr.Month + '_' + vm.msr.Year + '.png'
      console.log('CONTENT CHANGED: ' + content)
      vm.fileContent = content
      if (content.indexOf('blob') > 0) {
        vm.fileType = vm.ActiveSection
        let parts = content.split('blob:')
        let url = parts[1].substring(0, 62) // 62 is the length of the full url 63 in O365
        url = 'blob:' + url
        if (console) {
          console.log('BLOB URL: ' + url)
        }
        vm.fileBlob = url
        vm.hasImage = true
      }
    },
    async uploadMSRImage(name, buffer, digest) {
      let endpoint = String.format("{0}/_api/lists/getbytitle('{1}')/RootFolder/Files/Add(url='{2}',overwrite=true)", server, library, name)
      let data = buffer
      let headers = {
        Accept: 'application/json;odata=verbose',
        'X-RequestDigest': digest
      }
      try {
        const response = await axios({
          url: endpoint,
          method: 'POST',
          data: data,
          processData: false,
          headers: headers
        })
        return response
      } catch (error) {
        console.log('MSRService Error Uploading Image: ' + error)
      }
    },
    async uploadMSR(name, buffer, digest) {
      let endpoint = String.format("{0}/_api/lists/getbytitle('{1}')/RootFolder/Files/Add(url='{2}',overwrite=true)", server, 'MSRLibrary', name)
      let data = buffer
      let headers = {
        Accept: 'application/json;odata=verbose',
        'X-RequestDigest': digest
      }
      try {
        const response = await axios({
          url: endpoint,
          method: 'POST',
          data: data,
          processData: false,
          headers: headers
        })
        return response
      } catch (error) {
        console.log('MSRService Error Uploading MSR: ' + error)
      }
    },
    async getFileBuffer(file) {
      let p = new Promise(function(resolve, reject) {
        var reader = new FileReader()
        reader.onloadend = function(e) {
          resolve(e.target.result)
        }
        reader.onerror = function(e) {
          reject(e.target.error)
        }
        reader.readAsArrayBuffer(file)
      })
      return p
    },
    formatData2: function(type, data) {
      // parse data if present
      let exists = false
      let r = null
      try {
        r = JSON.parse(data)
        for (let i = 0; i < r.length; i++) {
          r[i].HTML = decodeURIComponent(r[i].HTML)
        }
        exists = true
        console.log('PARSED DATA: ' + r)
      } catch (e) {
        // No real need to do anything here
      }

      let s = []
      if (this.subsloaded && this.subs.length > 1) {
        let subs = String(this.subs)
        if (subs.indexOf(',') > 0) {
          // multiple subs
          subs = subs.split(', ')
          for (let h = 0; h < subs.length; h++) {
            s.push({
              Index: h,
              Company: subs[h],
              Email: this.Email,
              Private: 'No',
              Completed: 'No',
              HTML: 'None'
            })
          }
        } else {
          // only 1 sub
          s.push({
            Index: 0,
            Company: subs,
            Email: this.Email,
            Private: 'No',
            Completed: 'No',
            HTML: 'None'
          })
        }
        if (exists && r.length > 0) {
          for (let k = 0; k < s.length; k++) {
            let company = s[k]['Company']
            for (let i = 0; i < r.length; i++) {
              if (r[i]['Company'] == company) {
                s[k]['Email'] = r[i]['Email']
                s[k]['Private'] = r[i]['Private']
                s[k]['Completed'] = r[i]['Completed']
                s[k]['HTML'] = r[i].HTML
              }
            }
          }
        }
        return s
      } else {
        // TODO: Allow CACI users to add inputs
        return s
      }
    },
    async publishMSR() {
      this.fileName = this.WorkplanNumber + '-' + this.msr.Month + '-' + this.msr.Year + '.docx'
      let response = await this.getFormDigest()
      this.fileDigest = response.data.d.GetContextWebInformation.FormDigestValue
      let y = String(
        this.$moment()
          .subtract(1, 'months')
          .year()
      )
      let m = this.$moment()
        .subtract(1, 'months')
        .get('month')
      let popstart = this.$moment(m)
        .startOf('month')
        .date()
      let popend = this.$moment(m)
        .endOf('month')
        .date()
      let pop = months[m] + ' ' + popstart + ' - ' + popend + ' ' + y
      let published = this.$moment().format('DD MMM YYYY')

      this.busyTitle = 'Publishing To SharePoint'
      this.$bvToast.show('form-toast')

      /* #region Document Creation */
      const header = new Table({
        width: {
          size: 10800,
          type: WidthType.DXA
        },
        borders: {
          top: {
            style: BorderStyle.NONE,
            size: 0,
            color: '#ffffff'
          },
          bottom: {
            style: BorderStyle.NONE,
            size: 0,
            color: '#ffffff'
          },
          left: {
            style: BorderStyle.NONE,
            size: 0,
            color: '#ffffff'
          },
          right: {
            style: BorderStyle.NONE,
            size: 0,
            color: '#ffffff'
          }
        },
        alignment: AlignmentType.CENTER,
        rows: [
          new TableRow({
            children: [
              new TableCell({
                children: [new Paragraph({})],
                width: {
                  size: 3600,
                  type: WidthType.DXA
                },
                borders: {
                  top: {
                    style: BorderStyle.NONE,
                    size: 0,
                    color: '#ffffff'
                  },
                  bottom: {
                    style: BorderStyle.NONE,
                    size: 0,
                    color: '#ffffff'
                  },
                  left: {
                    style: BorderStyle.NONE,
                    size: 0,
                    color: '#ffffff'
                  },
                  right: {
                    style: BorderStyle.NONE,
                    size: 0,
                    color: '#ffffff'
                  }
                },
                verticalAlign: VerticalAlign.CENTER
              }),
              new TableCell({
                children: [
                  new Paragraph({
                    text: 'CONTROLLED UNCLASSIFIED INFORMATION (CUI)',
                    alignment: AlignmentType.CENTER
                  })
                ],
                width: {
                  size: 3600,
                  type: WidthType.DXA
                },
                borders: {
                  top: {
                    style: BorderStyle.NONE,
                    size: 0,
                    color: '#ffffff'
                  },
                  bottom: {
                    style: BorderStyle.NONE,
                    size: 0,
                    color: '#ffffff'
                  },
                  left: {
                    style: BorderStyle.NONE,
                    size: 0,
                    color: '#ffffff'
                  },
                  right: {
                    style: BorderStyle.NONE,
                    size: 0,
                    color: '#ffffff'
                  }
                },
                verticalAlign: VerticalAlign.CENTER
              }),
              new TableCell({
                children: [
                  new Paragraph({
                    text: 'CDRL A001      FA8750-19-F-1000',
                    alignment: AlignmentType.RIGHT
                  })
                ],
                width: {
                  size: 3600,
                  type: WidthType.DXA
                },
                borders: {
                  top: {
                    style: BorderStyle.NONE,
                    size: 0,
                    color: '#ffffff'
                  },
                  bottom: {
                    style: BorderStyle.NONE,
                    size: 0,
                    color: '#ffffff'
                  },
                  left: {
                    style: BorderStyle.NONE,
                    size: 0,
                    color: '#ffffff'
                  },
                  right: {
                    style: BorderStyle.NONE,
                    size: 0,
                    color: '#ffffff'
                  }
                },
                verticalAlign: VerticalAlign.CENTER
              })
            ]
          }),
          new TableRow({
            children: [
              new TableCell({
                children: [new Paragraph({})],
                width: {
                  size: 3600,
                  type: WidthType.DXA
                },
                borders: {
                  top: {
                    style: BorderStyle.NONE,
                    size: 0,
                    color: '#ffffff'
                  },
                  bottom: {
                    style: BorderStyle.NONE,
                    size: 0,
                    color: '#ffffff'
                  },
                  left: {
                    style: BorderStyle.NONE,
                    size: 0,
                    color: '#ffffff'
                  },
                  right: {
                    style: BorderStyle.NONE,
                    size: 0,
                    color: '#ffffff'
                  }
                },
                verticalAlign: VerticalAlign.CENTER
              }),
              new TableCell({
                children: [
                  new Paragraph({
                    text: 'Work Plan:  ' + this.msr.WorkplanNumber + ' - ' + this.msr.WorkplanTitle,
                    alignment: AlignmentType.RIGHT
                  })
                ],
                width: {
                  size: 3600,
                  type: WidthType.DXA
                },
                borders: {
                  top: {
                    style: BorderStyle.NONE,
                    size: 0,
                    color: '#ffffff'
                  },
                  bottom: {
                    style: BorderStyle.NONE,
                    size: 0,
                    color: '#ffffff'
                  },
                  left: {
                    style: BorderStyle.NONE,
                    size: 0,
                    color: '#ffffff'
                  },
                  right: {
                    style: BorderStyle.NONE,
                    size: 0,
                    color: '#ffffff'
                  }
                },
                columnSpan: 2,
                verticalAlign: VerticalAlign.CENTER
              })
            ]
          })
        ]
      })

      const footer = new Table({
        width: {
          size: 10800,
          type: WidthType.DXA
        },
        borders: {
          top: {
            style: BorderStyle.NONE,
            size: 0,
            color: '#ffffff'
          },
          bottom: {
            style: BorderStyle.NONE,
            size: 0,
            color: '#ffffff'
          },
          left: {
            style: BorderStyle.NONE,
            size: 0,
            color: '#ffffff'
          },
          right: {
            style: BorderStyle.NONE,
            size: 0,
            color: '#ffffff'
          }
        },
        alignment: AlignmentType.CENTER,
        rows: [
          new TableRow({
            children: [
              new TableCell({
                children: [new Paragraph({})],
                width: {
                  size: 3600,
                  type: WidthType.DXA
                },
                borders: {
                  top: {
                    style: BorderStyle.NONE,
                    size: 0,
                    color: '#ffffff'
                  },
                  bottom: {
                    style: BorderStyle.NONE,
                    size: 0,
                    color: '#ffffff'
                  },
                  left: {
                    style: BorderStyle.NONE,
                    size: 0,
                    color: '#ffffff'
                  },
                  right: {
                    style: BorderStyle.NONE,
                    size: 0,
                    color: '#ffffff'
                  }
                },
                verticalAlign: VerticalAlign.CENTER
              }),
              new TableCell({
                children: [
                  new Paragraph({
                    text: 'CONTROLLED UNCLASSIFIED INFORMATION (CUI)',
                    alignment: AlignmentType.CENTER
                  })
                ],
                width: {
                  size: 3600,
                  type: WidthType.DXA
                },
                borders: {
                  top: {
                    style: BorderStyle.NONE,
                    size: 0,
                    color: '#ffffff'
                  },
                  bottom: {
                    style: BorderStyle.NONE,
                    size: 0,
                    color: '#ffffff'
                  },
                  left: {
                    style: BorderStyle.NONE,
                    size: 0,
                    color: '#ffffff'
                  },
                  right: {
                    style: BorderStyle.NONE,
                    size: 0,
                    color: '#ffffff'
                  }
                },
                verticalAlign: VerticalAlign.CENTER
              }),
              new TableCell({
                children: [
                  new Paragraph({
                    children: [
                      new TextRun({
                        children: ['Page Number ', PageNumber.CURRENT]
                      }),
                      new TextRun({
                        children: [' of ', PageNumber.TOTAL_PAGES]
                      })
                    ],
                    alignment: AlignmentType.RIGHT
                  })
                ],
                width: {
                  size: 3600,
                  type: WidthType.DXA
                },
                borders: {
                  top: {
                    style: BorderStyle.NONE,
                    size: 0,
                    color: '#ffffff'
                  },
                  bottom: {
                    style: BorderStyle.NONE,
                    size: 0,
                    color: '#ffffff'
                  },
                  left: {
                    style: BorderStyle.NONE,
                    size: 0,
                    color: '#ffffff'
                  },
                  right: {
                    style: BorderStyle.NONE,
                    size: 0,
                    color: '#ffffff'
                  }
                },
                verticalAlign: VerticalAlign.CENTER
              })
            ]
          })
        ]
      })

      const coverpage = [
        new Paragraph({
          children: [
            new TextRun({
              text: 'Progress, Status and Management Report –F3I-2',
              bold: true,
              font: 'Calibri',
              size: 36
            })
          ],
          alignment: AlignmentType.CENTER,
          spacing: {
            before: 200
          }
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: 'CDRL A001, WP ' + this.msr.WorkplanNumber,
              bold: true,
              font: 'Calibri',
              size: 36
            })
          ],
          alignment: AlignmentType.CENTER
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: this.msr.WorkplanTitle,
              bold: true,
              font: 'Calibri',
              size: 36
            })
          ],
          alignment: AlignmentType.CENTER
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: 'USAF, AFMC',
              bold: true,
              font: 'Calibri',
              size: 36
            })
          ],
          alignment: AlignmentType.CENTER
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: 'Air Force Research Laboratory',
              bold: true,
              font: 'Calibri',
              size: 36
            })
          ],
          alignment: AlignmentType.CENTER
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: 'Full-Spectrum Intelligence, Surveillance, and Reconnaissance (ISR) Innovation and Integration 2 (F3I-2)',
              font: 'Calibri',
              size: 32
            })
          ],
          alignment: AlignmentType.CENTER,
          spacing: {
            before: 200
          }
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: 'ContractNo.FA8750-19-F-1000',
              font: 'Calibri',
              size: 32
            })
          ],
          alignment: AlignmentType.CENTER
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: 'Date: ' + published,
              font: 'Calibri',
              size: 28
            })
          ],
          alignment: AlignmentType.CENTER,
          spacing: {
            before: 8500
          }
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: 'Period Covered: ' + pop,
              font: 'Calibri',
              size: 28
            })
          ],
          alignment: AlignmentType.CENTER
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: 'DISTRIBUTION D. ',
              font: 'Calibri',
              bold: true,
              size: 22
            }),
            new TextRun({
              text: 'Distribution authorized to DoD and U.S. DoD contractors only. Other requests for this document shall be referred to AF DCGS Data Management Office. AFLCMC/HBGB 235 Byron St, Suite 19A, Robins AFB, GA 31098-1670',
              font: 'Calibri',
              size: 22
            })
          ],
          alignment: AlignmentType.LEFT,
          spacing: {
            before: 300,
            after: 300
          }
        })
      ]

      const styles = {
        paragraphStyles: [
          {
            id: 'Heading1',
            name: 'Heading 1',
            basedOn: 'Normal',
            next: 'Normal',
            quickFormat: true,
            run: {
              size: 36,
              color: 'black'
            },
            paragraph: {
              spacing: {
                after: 180,
                before: 360
              },
              indent: {
                left: 0
              },
              alignment: AlignmentType.LEFT
            }
          },
          {
            id: 'Heading2',
            name: 'Heading 2',
            basedOn: 'Normal',
            next: 'Normal',
            quickFormat: true,
            run: {
              size: 32,
              color: 'black'
            },
            paragraph: {
              spacing: {
                after: 180,
                before: 360
              },
              indent: {
                left: 0
              },
              alignment: AlignmentType.LEFT
            }
          },
          {
            id: 'Heading3',
            name: 'Heading 3',
            basedOn: 'Normal',
            next: 'Normal',
            quickFormat: true,
            run: {
              size: 28,
              color: 'black'
            },
            paragraph: {
              spacing: {
                after: 180,
                before: 360
              },
              indent: {
                left: 0
              },
              alignment: AlignmentType.LEFT
            }
          },
          {
            id: 'Heading4',
            name: 'Heading 4',
            basedOn: 'Normal',
            next: 'Normal',
            quickFormat: true,
            run: {
              size: 24,
              color: 'black'
            },
            paragraph: {
              spacing: {
                after: 180,
                before: 360
              },
              indent: {
                left: 0
              },
              alignment: AlignmentType.LEFT
            }
          },
          {
            id: 'Heading5',
            name: 'Heading 5',
            basedOn: 'Normal',
            next: 'Normal',
            quickFormat: true,
            run: {
              size: 22,
              color: 'black'
            },
            paragraph: {
              spacing: {
                after: 180,
                before: 360
              },
              indent: {
                left: 0
              },
              alignment: AlignmentType.LEFT
            }
          }
        ]
      }

      const documentCreator = new CreateDocFromHtml({
        id: 'Publish',
        header: header,
        footer: footer,
        coverpage: coverpage,
        styles: styles,
        sectionWidth: 10800,
        sectionHeight: 15840,
        sectionmargins: {
          top: 720,
          right: 1440,
          bottom: 720,
          left: 1440,
          header: 720,
          footer: 720,
          gutter: 0
        },
        alignment: AlignmentType.CENTER
      })

      documentCreator.getImagesFromSource()
      // eslint-disable-next-line no-unused-vars
      documentCreator.loadImages().then(baboon => {
        const doc = documentCreator.create()
        Packer.toBlob(doc).then(blob => {
          // saveAs(blob, "example.docx");
          vm.getFileBuffer(blob).then(function(b) {
            vm.fileBuffer = b
            vm.uploadMSR(vm.fileName, vm.fileBuffer, vm.fileDigest).then(function(response) {
              console.log('FILE UPLOADED: ' + response)
              // TODO: Update the MSR Document with appropriate metadata
              let uri = response.data.d.ListItemAllFields.__deferred.uri
              MSR.dispatch('getMSRDocument', uri).then(function(response) {
                let payload = response.data.d.__metadata
                payload.WorkplanNumber = vm.WorkplanNumber
                payload.WorkplanTitle = vm.WorkplanTitle
                payload.Month = months[m]
                payload.Year = y
                MSR.dispatch('updateMSRDocument', payload).then(function() {
                  // Set MSR Status to Published
                  payload = {}
                  payload.uri = vm.msr.uri
                  payload.etag = vm.msr.etag
                  MSR.dispatch('publishMSR', payload)
                  vm.$bvToast.hide('form-toast')
                  vm.$emit('close')
                })
              })
            })
          })
        })
      })
      /* #endregion */
    }
  },
  cron: [
    {
      time: 600000,
      method: 'getFormStatus'
    },
    {
      time: 120000,
      method: 'closeForm',
      autoStart: false
    },
    {
      time: 300000,
      method: 'saveReminder',
      autoStart: true
    }
  ],
  provide: {
    richtexteditor: [Toolbar, Link, Image, Count, HtmlEditor, QuickToolbar, RTETable]
  },
  watch: {
    Show: function() {
      if (this.Show == true) {
        this.$bvToast.show('form-toast')
        this.WorkplanTitle = this.msrdata.WorkplanTitle
        this.WorkplanNumber = this.msrdata.WorkplanNumber
        this.Email = this.user[0].Email
        this.Company = this.user[0].Company
        let m = this.$moment().get('month')
        this.Month = months[m]
        this.Year = String(this.$moment().year())
        MSR.dispatch('getDigest')
        Workplan.dispatch('getSubs', this.WorkplanNumber).then(function() {
          vm.$options.interval = setInterval(vm.getData, 1000)
        })
      } else {
        // TODO: Do we need to clean up here? Or do some other action
      }
    }
  }
}
</script>

<style lang="scss">
.formheader,
.formfooter {
  height: 50px !important;
}
.modal-footer {
  padding: 0 !important;
  border: none;
}
.formbody {
  padding: 0 1rem !important;
  overflow-y: scroll;
}
.defaultcalibri .e-rte-content .e-content {
  font-family: 'Calibri';
}
#publish h2 {
  font-size: 16px;
}

#publish h3 {
  font-size: 14px;
}

#publish h4 {
  font-size: 12px;
}

#publish h5 {
  font-size: 11px;
}

.formbutton {
  margin: 5px;
}

.form-control-sm {
  height: calc(1.5em + 0.5rem + 2px) !important;
  padding: 0.25rem 0.5rem !important;
  font-size: 1rem !important;
  line-height: 1.5 !important;
  border: 1px solid black !important;
}

.flexcontainer {
  display: flex;
  flex-direction: column;
  flex-flow: column nowrap;
}

.messagerow {
  height: 50px;
}

.buttonrow {
  height: 50px;
  max-height: 50px;
  flex: 0 0 auto;
}

.tabrow {
  flex: 1;
  overflow-y: scroll;
}

.card {
  width: 100%;
}

.e-richtexteditor .e-rte-content .e-content,
.e-richtexteditor .e-source-content .e-content {
  padding: 10px !important;
  /* min-height: calc(100vh - 350px) !important; */
}

.e-rte-content p {
  margin: 0 0 10px !important;
  margin-bottom: 10px !important;
}

.e-rte-content li {
  margin-bottom: 10px !important;
}

.e-rte-content h1 {
  font-size: 2em !important;
  font-weight: 400 !important;
  line-height: 1 !important;
  margin: 10px 0 !important;
}

.e-rte-content h2 {
  font-size: 1.75em !important;
  font-weight: 400 !important;
  margin: 2px 0 !important;
}

.e-rte-content h3 {
  font-size: 1.5em !important;
  font-weight: 400 !important;
  margin: 10px 0 !important;
}

.e-rte-content h4 {
  font-size: 1.25em !important;
  font-weight: 400 !important;
  margin: 0 !important;
}

.e-rte-content h5 {
  font-size: 00.8em !important;
  font-weight: 400 !important;
  margin: 0 !important;
}

.e-rte-content h6 {
  font-size: 00.65em !important;
  font-weight: 400 !important;
  margin: 0 !important;
}

.e-rte-content blockquote {
  margin: 10px 0 !important;
  margin-left: 0 !important;
  padding-left: 5px !important;
}

.e-rte-content pre {
  background-color: inherit !important;
  border: 0 !important;
  border-radius: 0 !important;
  color: #333 !important;
  font-size: inherit !important;
  line-height: inherit !important;
  margin: 0 0 10px !important;
  overflow: visible !important;
  padding: 0 !important;
  white-space: pre-wrap !important;
  word-break: inherit !important;
  word-wrap: break-word !important;
}

.e-rte-content strong,
.e-rte-content b {
  font-weight: 700 !important;
}

.e-rte-content a {
  text-decoration: none !important;
  -webkit-user-select: auto !important;
  -ms-user-select: auto !important;
  user-select: auto !important;
}

.e-rte-content a:hover {
  text-decoration: underline !important;
}

.e-rte-content h3 + h4,
.e-rte-content h4 + h5,
.e-rte-content h5 + h3 {
  margin-top: 00.6em !important;
}

.e-rte-content .e-rte-image.e-imgbreak {
  border: 0 !important;
  cursor: pointer !important;
  display: block !important;
  float: none !important;
  margin: 5px auto !important;
  max-width: 100% !important;
  position: relative !important;
}

.e-rte-content .e-rte-image {
  border: 0 !important;
  cursor: pointer !important;
  display: block !important;
  float: none !important;
  margin: auto !important;
  max-width: 100% !important;
  position: relative !important;
}

.e-rte-content .e-rte-image.e-imginline {
  display: inline-block !important;
  float: none;
  margin-left: 5px !important;
  margin-right: 5px !important;
  max-width: calc(100% - (2 * 5px)) !important;
  vertical-align: bottom !important;
}

.e-rte-content .e-rte-image.e-imgcenter {
  cursor: pointer !important;
  display: block !important;
  float: none !important;
  margin: 5px auto !important;
  max-width: 100% !important;
  position: relative !important;
}

.e-rte-content .e-rte-image.e-imgleft {
  float: left !important;
  margin: 0 5px 0 0 !important;
  text-align: left !important;
}

.e-rte-content .e-rte-image.e-imgright {
  float: right !important;
  margin: 0 0 0 5px !important;
  text-align: right !important;
}

.e-rte-content .e-rte-img-caption {
  display: inline-block !important;
  margin: 5px auto !important;
  max-width: 100% !important;
  position: relative !important;
}

.e-rte-content .e-rte-img-caption.e-caption-inline {
  display: inline-block !important;
  margin: 5px auto !important;
  margin-left: 5px !important;
  margin-right: 5px !important;
  max-width: calc(100% - (2 * 5px)) !important;
  position: relative !important;
  text-align: center !important;
  vertical-align: bottom !important;
}

.e-rte-content .e-rte-img-caption.e-imgcenter {
  display: block !important;
}

.e-rte-content .e-rte-img-caption .e-rte-image.e-imgright,
.e-rte-content .e-rte-img-caption .e-rte-image.e-imgleft {
  float: none !important;
  margin: 0 !important;
}

.e-rte-content .e-rte-table {
  border-collapse: collapse !important;
  empty-cells: show !important;
}

.e-rte-content .e-rte-table td,
.e-rte-content .e-rte-table th {
  border: 1px solid #bdbdbd !important;
  height: 20px !important;
  min-width: 20px !important;
  padding: 2px 5px !important;
  vertical-align: middle !important;
}

.e-rte-content .e-rte-table.e-dashed-border td,
.e-rte-content .e-rte-table.e-dashed-border th {
  border-style: dashed !important;
}

.e-rte-content .e-rte-img-caption .e-img-inner {
  box-sizing: border-box !important;
  display: block !important;
  font-size: 16px !important;
  font-weight: initial !important;
  margin: auto !important;
  opacity: 0.9 !important;
  position: relative !important;
  text-align: center !important;
  width: 100% !important;
}

.e-rte-content .e-rte-img-caption .e-img-wrap {
  display: inline-block !important;
  margin: auto !important;
  padding: 0 !important;
  width: 100% !important;
}

.e-rte-content blockquote {
  border-left: solid 2px #333 !important;
}

.e-rte-content a {
  color: #2e2ef1 !important;
}

.e-rte-content .e-rte-table th {
  background-color: #e0e0e0 !important;
}
</style>
