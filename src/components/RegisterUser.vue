<template>
    <q-form
    @submit="registerUser"
    @reset="resetForm"
    ref="registerUserForm"
    class="q-col-gutter-md row"
    >
        <div class="col-6">                           
            <q-input
                outlined
                v-model="firstUserName"
                mask="Aaaaaaaaaaaaaaaaa"
                label="Primer Nombre"
                lazy-rules
                :rules="[
                    val => val !== null && val !=='' || 'Rellena el campo',
                    val => val.length > 2 || 'Introduce minimo 3 Caracteres',
                    val => val.length < 19 || 'Introduce un nombre real',
                ]"
            ></q-input>
        </div>
        <div class="col-6">                           
            <q-input
                outlined
                v-model="lastUserName"
                mask="Aaaaaaaaaaaaaaaaa"
                label="Segundo Nombre"
                lazy-rules
                :rules="[
                    val => val !== null && val !=='' || 'Rellena el campo',
                    val => val.length > 2 || 'Introduce minimo 3 Caracteres',
                    val => val.length < 19 || 'Introduce un nombre real',
                ]"
            ></q-input>
        </div>
        <div class="col-12">
            <q-input
                outlined
                type="number"
                v-model="ageUser"
                label="Edad"
                lazy-rules
                :rules="[
                    val => val !== null && val !== '' || 'Rellena el campo',
                    val => val > 0 && val < 128 || 'Introduce una edad real'
                ]"
            ></q-input>
        </div>
        <div class="col-12">
            <q-input
                type="email"
                outlined
                v-model="mailUser"
                label="Correo"
                lazy-rules
                :rules="[
                    val => val !== null && val !== '' || 'Rellena el campo',
                ]"
            ></q-input>
        </div>
        <div class="col-12">
            <q-input
                label="Contraseña"
                v-model="passwordUser" 
                outlined
                lazy-rules
                :rules="[
                    val => val !== null && val !=='' || 'Rellena el campo',
                    val => val.length > 2 || 'Introduce minimo 3 Caracteres',
                    val => val.length < 16 || 'Introduce maximo 15 caracteres',
                ]"
                :type="isPwd ? 
                'password' : 'text'" 
                >
                    <template v-slot:append>
                        <q-icon
                            :name="isPwd ? 'visibility_off' : 'visibility'"
                            class="cursor-pointer"
                            @click="isPwd = !isPwd"
                        />
                    </template>
                </q-input>
        </div>
        <div class="col-12">
            <q-btn push color="green-5" type="submit" icon="cloud_upload" text-color="white" label="Registrarse"></q-btn>
            <q-btn push color="blue-5" icon="refresh" class="q-ml-sm" type="reset" text-color="white" label="Resetear"></q-btn>
        </div>
    </q-form>
</template>

<script>
import { ref } from 'vue'
import { useQuasar } from 'quasar'

export default {
  setup () {
    const $q = useQuasar()
    const registerUserForm = ref(null)
    const firstUserName = ref(null)
    const lastUserName = ref(null)
    const ageUser = ref(null)
    const mailUser = ref(null)
    const passwordUser = ref(null)
    return {
        registerUserForm,
        firstUserName,
        lastUserName,
        ageUser,
        mailUser,
        passwordUser,
        isPwd: ref(true),
        succesfullRegiserNotify(){
            $q.notify({
                color: 'green-5',
                textColor: 'white',
                icon: 'done',
                message: '¡Te has registrado!'
            })
        },
        errorRegiserNotify(){
            $q.notify({
                color: 'red-5',
                textColor: 'white',
                icon: 'error',
                message: '¡Este correo ya esta en uso!'
            })
        },
    }
  },
  methods:
    {
        registerUser()
            {
                fetch('http://192.168.100.170:5565/users/register', {
                     method: 'POST',
                        body: JSON.stringify({
                        firstName: this.firstUserName,
                        lastName: this.lastUserName,
                        age: this.ageUser,
                        password: this.passwordUser,
                        email: this.mailUser
                        }),
                    headers:{
                        'Content-Type': 'application/json'
                    }
                    })
                    .then(response => response.json())
                    .then(registerResponse => {
                        if(registerResponse.error == "FATAL_ERROR_REGISTER_USER")
                            {
                                this.errorRegiserNotify()
                                this.mailUser = null
                            }
                        else
                            {
                                this.$refs.registerUserForm.resetValidation()
                                this.succesfullRegiserNotify()
                                this.resetForm()
                            }
                    })
            },
        resetForm(e)
            {
                this.firstUserName = null
                this.lastUserName = null
                this.ageUser = null
                this.passwordUser = null
                this.mailUser = null
            }
    }
}
</script>