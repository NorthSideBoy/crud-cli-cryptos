<template>
    <q-page padding>
        <div class="row justify-center">
            <div class="col-12">
                <q-card>
                    <q-card-section>
                        <div class="text-h5 q-pb-md">
                            <q-badge class="text-h5 shadow-2" color="green-5">
                                !Registra una Cryptomoneda!
                            </q-badge>
                        </div>
                        <div>
                            <cryptos-register-q-form-vue />
                        </div>
                    </q-card-section>
                </q-card>
            </div>
            <div class="col-12 q-pt-md">
                <cryptos-q-table />
            </div>
        </div>
    </q-page>
</template>
<script>
import CryptosQTable from 'components/CryptosQTable.vue'
import CryptosRegisterQFormVue from 'src/components/CryptosRegisterQForm.vue'
export default {
    components: { CryptosQTable, CryptosRegisterQFormVue}
    }
</script>
