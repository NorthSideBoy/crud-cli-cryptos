<template>
    <q-form
    @submit="loginUser"
    @reset="resetForm"
    ref="loginUserForm"
    class="q-col-gutter-md row"
    >
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
            <q-btn push color="green-5" type="submit" icon="login" text-color="white" label="Iniciar Sesion"></q-btn>
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
    const mailUser = ref(null)
    const passwordUser = ref(null)
    const loginUserForm = ref(null)
    const dataLogin = ref(null)
    return {
        mailUser,
        passwordUser,
        loginUserForm,
        dataLogin,
        isPwd: ref(true),
        errorUserNotExistLogin(){
            $q.notify({
                color: 'red-5',
                textColor: 'white',
                icon: 'error',
                message: '¡Este usuario no existe!'
            })
        },
        errorInvalidPassword(){
            $q.notify({
                color: 'red-5',
                textColor: 'white',
                icon: 'error',
                message: '¡La contraseña es invalida!'
            })
        },
        succesfullLogin(){
            $q.notify({
                color: 'blue-5',
                textColor: 'white',
                icon: 'done',
                message: '¡Bienvenido!'
            })
        },
    }
  },
  methods:
    {
        loginUser()
            {
                fetch('http://192.168.100.170:5565/users/login', {
                     method: 'POST',
                        body: JSON.stringify({
                        email: this.mailUser,
                        password: this.passwordUser,
                        }),
                    headers:{
                        'Content-Type': 'application/json'
                    }
                    })
                    .then(response => response.json())
                    .then(registerResponse => {
                        if(registerResponse.error == "USER_NOT_EXISTS")
                            {
                                this.errorUserNotExistLogin()
                                this.mailUser = null
                            }
                        else if (registerResponse.error == "PASSWORD_INVALID")
                            {
                                this.errorInvalidPassword()
                                this.passwordUser = null
                            }
                        else
                            {
                                this.succesfullLogin()
                                console.log(registerResponse.data.token) 
                                this.$refs.loginUserForm.resetValidation()
                                this.resetForm()
                            }
                    })
            },
        resetForm()
            {
                this.mailUser = null
                this.passwordUser = null       
            }
    }
}
</script>