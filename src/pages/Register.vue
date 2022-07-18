<template>
    <q-page padding>
        <div class="row justify-center">
            <div class="col-12 col-sm-6">
                <q-card>
                    <q-card-section>
                        <div class="text-h5 q-pb-md">
                            <q-badge class="text-h5 shadow-2" color="green-5">
                                !Registrate!
                            </q-badge>
                        </div>
                        <cryptos-register-q-form-vue />
                        <div class="q-mt-lg">
                            <register-user></register-user>
                        </div>
                    </q-card-section>
                </q-card>
            </div>
        </div>
    </q-page>
</template>
<script>
import RegisterUser from 'components/RegisterUser.vue'
export default {
    components: { RegisterUser }
    }
</script>
