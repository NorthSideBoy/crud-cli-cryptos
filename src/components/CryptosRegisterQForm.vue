<template>
    <q-form
    @submit="sendForm"
    @reset="onReset"
    ref="registerForm"
    class="q-col-gutter-md row"
    >
        <div class="col-12 col-sm-6">                           
            <q-input
                outlined
                v-model="name"
                mask="Aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"
                label="Inserta un nombre"
                lazy-rules
                :rules="[
                    val => val !== null && val !=='' || 'Rellena el campo',
                    val => val.length > 3 || 'Introduce minimo 4 Caracteres'
                ]"
            ></q-input>
        </div>
        <div class="col-12 col-sm-6">
            <q-input
                outlined
                v-model="symbol"
                mask="AAAA"
                label="Inserta un simbolo"
                lazy-rules
                :rules="[
                    val => val !== null && val !== '' || 'Rellena el campo',
                ]"
            ></q-input>
        </div>
        <div class="col-12 col-sm-6">
            <q-input
                outlined
                type="number"
                v-model="value"
                label="Inserta un precio"
                lazy-rules
                :rules="[
                    val => val !== null && val !== '' || 'Rellena el campo',
                    val => val > 0 && val < 1e8 || 'Introduce un valor real'
                ]"
            ></q-input>
        </div>
        <div class="col-12 col-sm-6">
            <q-file
                filled
                bottom-slots 
                v-model="image" 
                bg-color="blue-2" 
                label="Inserta una imagen"
                accept="image/jpeg,.png,.svg"
                lazy-rules
                :rules="[val => val !==null && val !== ''|| 'Inserta una imagen']"
                counter
            >
                <template v-slot:prepend>
                    <q-icon name="file_upload" @click.stop />
                </template>
                <template v-slot:append>
                    <q-icon name="close" @click.stop="image = null" class="cursor-pointer" />
                </template>
                <template v-slot:hint>
                    file size
                </template>
            </q-file>
        </div>
        <div class="col-12">
            <q-btn push color="green-5" type="submit" icon="cloud_upload" text-color="white" label="Registrar"></q-btn>
            <q-btn push color="blue-5" icon="refresh" class="q-ml-sm" type="reset" text-color="white" label="Resetear"></q-btn>
        </div>
    </q-form>
</template>

<script>
    import {ref} from 'vue'
    import {useQuasar} from 'quasar'
import CryptosQTableVue from './CryptosQTable.vue'
    export default {
        setup(){
            const registerForm = ref(null)
            const name = ref(null)
            const symbol = ref(null)
            const value = ref(null)
            const image = ref(null)
            const mediaId = ref(null)
            const logotype = ref(null)
            const $q = useQuasar()
            return{
                name,
                symbol,
                value,
                image,
                mediaId,
                logotype,
                registerForm,
                sendFormNotify(){
                    $q.notify({
                        color: 'green-4',
                        textColor: 'white',
                        icon: 'cloud_done',
                        message: '¡Registrada!'
                    })
                }
            }
        },
    methods:
        {
            sendForm(e)
                {
                    e.preventDefault()
                    const formData = new FormData()
                    formData.append('myfile', this.image)
                    this.createImage(formData)
                },
            createImage(formData)
                {
                    fetch('http://192.168.100.170:5565/images', {
                        method: 'POST',
                        body: formData
                    })
                    .then(response => response.json())
                    .then(data => {
                        this.mediaId = data.data._id
                        this.logotype = data.data.url
                        this.createCrypto()
                    }) 
                },
            createCrypto()
                {
                    fetch('http://192.168.100.170:5565/crypto', {
                        method: 'POST',
                            body: JSON.stringify({
                            name: this.name,
                            symbol: this.symbol,
                            value: this.value,
                            mediaId: this.mediaId,
                            logotype: this.logotype
                        }),
                        headers:{
                            'Content-Type': 'application/json'
                        }
                    })
                    .then(response => response.json())
                    .then(finalyze => {
                        console.log(this.$refs.registerForm)
                        this.$refs.registerForm.resetValidation()
                        this.sendFormNotify()
                        this.onReset()
                    })
                },
            onReset()
                {
                    this.name = null
                    this.value = null
                    this.symbol = null
                    this.image = null
                    this.getCryptos()
                },
            getCryptos()
                {
                    CryptosQTableVue.methods.getCryptos()
                }
        }
    }
</script>
