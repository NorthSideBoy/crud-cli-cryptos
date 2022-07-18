<template>
  <q-table
  title="Cryptomonedas"
  no-data-label="No hay cryptomonedas"
  :rows="cryptosDataFiltered"
  :columns="columns"
  >
    <template v-slot:top-left>
      <div>
        <q-badge class="text-h6 shadow-3">
          Cryptomonedas
        </q-badge>
        <q-btn dense flat icon="info" color="grey-8" @click="getCryptosImfo"></q-btn>
      </div>   
    </template>
    <template v-slot:top-right>
      <q-input
        filled
        dense
        debounce="300"
        placeholder="Buscar Cryptomoneda"
        v-model="filter"
        bg-color="blue-1"
      >
        <template v-slot:append>
          <q-icon name="search" />
        </template>
        <template v-slot:before>
          <q-btn dense icon="refresh" color="blue-5" type="reset"  @click="resetFilter"></q-btn>
        </template>
      </q-input>
      </template>
      <template v-slot:body="props">
        <q-tr key="" :props="props">
          <q-td key="name" :props="props">
            {{ props.row.name }}
          </q-td>
          <q-td key="symbol" :props="props">
            {{ props.row.symbol }}
          </q-td>
          <q-td key="value" :props="props">
            <q-badge color="green">
              {{ props.row.value }}
              <q-icon name="attach_money"></q-icon>
            </q-badge>   
          </q-td>
          <q-td key="logotype" :props="props">
            <q-avatar size="100px" class="shadow-5">
              <img :src="props.row.logotype">
            </q-avatar>      
          </q-td>
          <q-td key="actions" :props="props">
            <q-btn dense flat color="blue-5" icon="edit" @click="updateSendForm(props.row.name, props.row.symbol, props.row.value, props.row.logotype, props.row._id, props.row.mediaId)"></q-btn>
            <q-btn dense flat color="red-5" icon="delete" @click="confirmDeleteCrypto(props.row._id, props.row.mediaId, props.row.name, props.row.logotype)"></q-btn>
            <q-btn dense flat icon="info" color="grey-8"  @click="getImfo(props.row)"></q-btn>
          </q-td>
          <q-dialog v-model="promptEdit" persistent>
            <q-card>
              <q-card-section>
                <div class="text-h6">Actualizar Cryptomoneda <strong>{{cryptoNameToUpdate}}</strong></div>
              </q-card-section>
              <q-card-section class="q-pt-none">
                <q-form
                @submit="(e) => sendFormUpdate(this.imageCryptoId, this.cryptoId, this.logotypeUpdateForm, e)"
                @reset="onUpdateReset"
                @validation-error="errorFormMessage"
                ref="updateForm"
                class="q-gutter-md"
                >
                  <q-input
                    outlined
                    v-model="updateName"
                    label="Inserta un nombre"
                    lazy-rules
                    mask="Aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"
                    :rules="[
                      val => val !== null && val !=='' || 'Rellena el campo',
                      val => val.length > 3 || 'Introduce minimo 4 Caracteres'
                    ]"
                    :hint="this.updateName"
                  ></q-input>
                  <q-input
                    outlined
                    type="text"
                    v-model="updateSymbol"
                    label="Inserta un simbolo"
                    lazy-rules
                    :rules="[ 
                      val => val !== null && val !== '' || 'Rellena el campo'
                    ]"
                    :hint="this.updateSymbol"
                    mask="AAAA"
                  ></q-input>
                  <q-input
                    outlined
                    type="number"
                    v-model="updateValue"
                    label="Inserta un precio"
                    :rules="[
                      val => val !== null && val !== '' || 'Rellena el campo',
                      val => val > 0 && val < 1e8 || 'Introduce un valor real'
                    ]"
                    :hint="this.updateValue"
                  ></q-input>
                  <q-file 
                    filled
                    bottom-slots
                    v-model="updateImage" 
                    bg-color="blue-2" 
                    label="Inserta una imagen(Opcional)"
                    accept="image/jpeg,.png,.svg"
                    counter
                  >
                    <template v-slot:prepend>
                      <q-icon name="file_upload"/>
                    </template>
                    <template v-slot:append>
                      <q-icon name="close" @click.stop="updateImage = null" class="cursor-pointer" />
                    </template>
                    <template v-slot:hint>
                      File size
                    </template>
                    <template v-slot:after>
                      <q-avatar size="70px" class="shadow-5">
                        <img :src="this.logotypeUpdateForm">
                      </q-avatar> 
                    </template>
                  </q-file>
                <div align="center">
                  <q-btn pust color ="red" icon="close" text-color="white" type="reset" label="Cancelar" v-close-popup></q-btn>
                  <q-btn push color="blue-5" icon="cloud_upload" class="q-ma-md" type="submit" text-color="white" label="Actualizar" v-close-popup></q-btn>
                </div>
              </q-form>
            </q-card-section>
          </q-card>
        </q-dialog>
        <q-dialog v-model="promptFailedUpdate" persistent>
        <q-card>
          <q-card-section align="center">
            <div class="text-h5 text-center">Parece que algo salio mal al intentar actualizar la Cryptomoneda <strong>{{cryptoNameToUpdate}}</strong>... :(</div>
              <div class="q-pa-md">
                <q-avatar size="150px">
                  <img :src="errorImage"/>
                </q-avatar>
              </div>
              <div class="text-h5 text-center q-pa-md"><strong>¿Porque ocurre este error?</strong></div>
                <div class="text-center q-pa-md">
                  <strong>
                    Cuando envies el formulario de actualización, asegurate de llenar todos los campos correctamente.
                  </strong>
                </div>
                <q-card-actions align="center" class="text-primary q-pa-md">
                  <q-btn pust color="blue-5" icon="check" text-color="white" label="Ok, entendido" v-close-popup />
                </q-card-actions>
              </q-card-section>         
            </q-card>
          </q-dialog>
          <q-dialog v-model="promptDelete" persistent>
            <q-card>
              <q-card-section align="center">
                <div class="text-h5 text-center">¡Estas por eliminar la Cryptomoneda <strong>{{cryptoNameToDelete}}</strong>!</div>
                <div class="q-pa-md">
                  <q-avatar size="150px" class="shadow-10">
                    <img :src="logotypeCryptoToDelete">
                  </q-avatar>
                </div>
                <div class="text-h5 text-center q-pa-md"><strong>¿Estas seguro?</strong></div>
              </q-card-section>         
              <q-card-actions align="center" class="text-primary">
                <div>
                  <q-btn pust color="green-5" icon="close" text-color="white" label="No, Cancelar" v-close-popup />
                </div>
                <div class="q-pa-md">
                  <q-btn push color="red-5" icon="delete" v-on:click="deleteCrypto(this.cryptoIdToDelete, this.cryptoMediaIdToDelete)" text-color="white" label="Si, Eliminar" v-close-popup></q-btn>
                </div>
              </q-card-actions>
            </q-card>
          </q-dialog>
          <q-dialog v-model="promptGetImfo" persistent>
            <q-card>
              <q-card-section align="center">
                <div class="text-h5 text-center q-pa-md"><strong>Objeto de la Cryptomoneda {{this.cryptoToImfo}}</strong></div>
                  <div class="text-center q-pa-md"><strong>
                    {{this.objectCrypto}}
                  </strong></div>
                <q-card-actions align="center" class="text-primary q-pa-md">
                  <q-btn pust color="blue-5" icon="close" text-color="white" label="Cerrar" v-close-popup />
                </q-card-actions>
              </q-card-section>         
            </q-card>
          </q-dialog>
          <q-dialog v-model="promptGetCryptosImfo" persistent>
            <q-card>
              <q-card-section align="center">
                <div class="text-h5 text-center q-pa-md"><strong>Data del arreglo con los Objetos de las Cryptomonedas</strong></div>
                <div class="text-center q-pa-md"><strong>
                  {{cryptosData}}
                </strong></div>
                <q-card-actions align="center" class="text-primary q-pa-md">
                  <q-btn pust color="blue-5" icon="close" text-color="white" label="Cerrar" v-close-popup />
                </q-card-actions>
              </q-card-section>         
            </q-card>
          </q-dialog>
        </q-tr>
      </template>
    </q-table>
    <div class="q-mt-md">
      <q-btn push color="blue-5" icon="refresh" type="button" v-on:click="getCryptos" text-color="white" label="Refrescar"></q-btn>
    </div>
</template>

<script>
    const cryptosData = ref([])
    const cryptosDataFiltered = ref([])
    const promptEdit = ref(false)
    const cryptoNameToUpdate = ref(null)
    const updateName = ref(null)
    const updateSymbol = ref(null)
    const updateValue = ref(null)
    const updateImage = ref(null)
    const logotypeUpdateForm = ref(null)
    const imageCryptoId = ref(null)
    const cryptoId = ref(null)
    const promptFailedUpdate = ref(null)
    const errorImage = "http://192.168.100.170:5565/file-1658009240618.png"
    const updateForm = ref(null)
    const logotypeCryptoToDelete = ref(null)
    const cryptoNameToDelete = ref(null)
    const promptDelete = ref(null)
    const cryptoIdToDelete = ref(null)
    const cryptoMediaIdToDelete = ref(null)
    const filterText = ref(null)
    const cryptoToImfo = ref(null)
    const objectCrypto = ref(null)
    const promptGetImfo = ref(null)
    const promptGetCryptosImfo = ref(null)
    const columns =[
        {
          name: 'name',
          required: true,
          label: 'Nombre',
          align: 'left',
          field: row => row.name,
          format: val => `${val}`,
          sortable: true
        },
        {
          name: 'symbol',
          required: true,
          label: 'Simbolo',
          align: 'left',
          field: row => row.symbol,
          format: val => `${val}`,
          sortable: true
        },
        { name: 'value', align: 'left', label: 'Valor', field: 'value', sortable: true },
        { name: 'logotype', label: 'Logotipo', align: 'center', field: 'logotype', sortable: false },
        { name: 'actions', label: 'Acciones', align: 'center', sortable: false }
    ]
    import {ref} from 'vue'
    import {useQuasar} from 'quasar'
    export default{
        setup(){
          const $q = useQuasar()
            return{
                columns,
                cryptosData,
                cryptosDataFiltered,
                promptEdit,
                cryptoNameToUpdate,
                updateName,
                updateSymbol,
                updateValue,
                updateImage,
                logotypeUpdateForm,
                imageCryptoId,
                cryptoId,
                promptFailedUpdate,
                errorImage,
                updateForm,
                logotypeCryptoToDelete,
                cryptoNameToDelete,
                promptDelete,
                cryptoIdToDelete,
                cryptoMediaIdToDelete,
                filterText,
                cryptoToImfo,
                objectCrypto,
                promptGetImfo,
                promptGetCryptosImfo,
                updateFormNotify(){
                    $q.notify({
                        color: 'blue-4',
                        textColor: 'white',
                        icon: 'cloud_done',
                        message: '¡Actualizada!'
                    })
                },
                deleteCryptoNotify(){
                    $q.notify({
                        color: 'red-4',
                        textColor: 'white',
                        icon: 'delete_forever',
                        message: '¡Eliminada!'
                    })
                }
            }
        },
        created()
            {
                this.getCryptos()
            },
        methods:
            {
                getCryptos()
                    {
                        fetch('http://192.168.100.170:5565/crypto')
                        .then(response => response.json())
                        .then(cryptoData => {
                            this.cryptosData = cryptoData.data
                            this.cryptosDataFiltered = this.cryptosData
                        })
                    },
                updateSendForm(nameToUpdate, symbolToUpdate, valueToUpdate, logotypeToUpdate, id, mediaId)
                    {
                        this.cryptoNameToUpdate = nameToUpdate
                        this.updateName = nameToUpdate
                        this.updateSymbol = symbolToUpdate
                        this.updateValue = valueToUpdate
                        this.logotypeUpdateForm = logotypeToUpdate
                        this.updateImage = null
                        this.imageCryptoId =  mediaId
                        this.cryptoId = id
                        this.promptEdit = true
                    },
                sendFormUpdate(mediaId, id, logotypeUpdateForm, e)
                    {
                      if(this.updateImage === null)
                        {
                          e.preventDefault()
                          fetch('http://192.168.100.170:5565/crypto/' + id, {
                            method: 'PUT',
                            body: JSON.stringify({
                            name: this.updateName,
                            symbol: this.updateSymbol,
                            value: this.updateValue,
                            mediaId: mediaId,
                            logotype: logotypeUpdateForm
                          }),
                          headers:{
                            'Content-Type': 'application/json'
                          }
                          })
                          .then(response => response.json())
                          .then(resultUpdate => {
                            this.updateFormNotify()
                            this.onUpdateReset()
                          })
                        }
                      else
                        {
                          e.preventDefault()
                          const formData = new FormData()
                          console.log(this.updateImage)
                          formData.append('myfile', this.updateImage)
                          this.updateImageCrypto(formData, mediaId, id)
                        }
                    },
                updateImageCrypto(formData, mediaId, id)
                    {
                        fetch('http://192.168.100.170:5565/images/' + mediaId, {
                            method: 'PUT',
                            body: formData
                        })
                        .then(response => response.json())
                        .then(imageResults => {
                            this.updateCrypto(id, imageResults)
                        })
                    },
                updateCrypto(id, imageResults)
                  {
                    fetch('http://192.168.100.170:5565/crypto/' + id, {
                      method: 'PUT',
                      body: JSON.stringify({
                        name: this.updateName,
                        symbol: this.updateSymbol,
                        value: this.updateValue,
                        mediaId: imageResults.fileData.identificador,
                        logotype: imageResults.fileData.url
                      }),
                      headers:{
                        'Content-Type': 'application/json'
                      }
                      })
                      .then(response => response.json())
                      .then(resultUpdate => {
                      this.updateFormNotify()
                      this.onUpdateReset()
                      })
                    },
                confirmDeleteCrypto(id, mediaId, cryptoNameToDelete, logotypeCryptoToDelete,)
                  {
                    this.logotypeCryptoToDelete = logotypeCryptoToDelete
                    this.cryptoNameToDelete = cryptoNameToDelete
                    this.promptDelete = true
                    this.cryptoIdToDelete =  id
                    this.cryptoMediaIdToDelete = mediaId
                  },
                deleteCrypto(id, mediaId)
                  {
                    this.filterText = null
                    fetch('http://192.168.100.170:5565/crypto/' + id, {
                    method: 'DELETE',
                    headers: {
                      'Accept': 'application/json',
                      'Content-type': 'application/json'
                    }
                    })
                    .then(res => res.json())
                    .then(data => {
                      this.deleteImage(mediaId)
                    })
                  },
                deleteImage(mediaId)
                  {
                    fetch('http://192.168.100.170:5565/images/' + mediaId, {
                    method: 'DELETE',
                    headers: {
                      'Accept': 'application/json',
                      'Content-type': 'application/json'
                    }
                    })
                    .then(res => res.json())
                    .then(data => {
                      this.deleteCryptoNotify()
                      this.getCryptos();
                    })
                  },
                onUpdateReset()
                  {
                    this.cryptoNameToUpdate = null
                    this.updateName = null
                    this.updateSymbol = null
                    this.updateValue = null
                    this.logotypeUpdateForm = null
                    this.updateImage = null
                    this.imageCryptoId =  null
                    this.cryptoId = null
                    this.filterText = null 
                    this.getCryptos()
                  },
                errorFormMessage()
                  {
                    this.promptFailedUpdate = true
                  },
                getCryptosImfo()
                  {
                    this.promptGetCryptosImfo = true
                  },
                getImfo(cryptoObject)
                  {
                    this.cryptoToImfo = cryptoObject.name
                    this.objectCrypto = cryptoObject
                    this.promptGetImfo = true
                  },
                cancel()
                  {
                    this.updateImage = null
                  },
                resetFilter()
                  {
                    this.filterText = ''
                    this.getCryptos()
                  }
            },
          computed:{
            filter:{
              get()
                {
                  return this.filterText
                },
              set(InputFilteredValue)
                {
                  InputFilteredValue = InputFilteredValue.toLowerCase()
                  this.cryptosDataFiltered = this.cryptosData.filter(
                    crypto => crypto.name.toLowerCase().indexOf(InputFilteredValue) !== -1
                  )
                  this.filterText = InputFilteredValue
                }
            }
          }
      }
</script>

