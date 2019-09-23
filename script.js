
new Vue({    
    el: "#app",
    data: {
        info : [],
        birthdays : null,
        today: new Date(),
        settings: null,
        newPerson: {
            name: '',
            company: '',
            birthday: '',
            email: ''
        }
    },
    methods: {
        deletePerson(id, i){
            fetch(this.api_url+"/persons/delete/"+id, {
                method: "DELETE"
            })
            window.location.reload(false); 
        },
        createPerson(){
            if(!this.newPerson.birthday) {
                delete this.newPerson.birthday
            }
            if(!this.newPerson.company) {
                delete this.newPerson.company
            }
            if(!this.newPerson.email) {
                delete this.newPerson.email
            }
            fetch(this.api_url+"/persons/create", {
                method: "POST",
                body: JSON.stringify(this.newPerson),
                headers : {
                    "Content-Type": "application/json"
                }
            })
            window.location.reload(false); 
        }
    },
    mounted () {
        this.api_url = settings.api_url
        fetch(this.api_url+"/persons/index")
            .then(response => response.json())
            .then((data) => {
                data.map(function($e){
                    return $e.phones != null ? $e.phones = $e.phones : $e.phones = ' '
                })
                this.info = data;
            })
            
        fetch(this.api_url+"/calendar/getbirthdays", {
            body: JSON.stringify({
                "month" : this.today.getMonth()+1,
                "day" : this.today.getDate()
            }),
            method: "POST",
            headers : {
                "Content-Type": "application/json"
            }
        })
            .then(response => response.json())
            .then((data) => {
                
                this.birthdays = data;
            })
    },
    template: `
    <div class="container">
            <div v-for="b in birthdays" class="row" style="margin-top:10px;">
                <div class="card w-100 text-white bg-secondary">
                    <h5 class="card-header">Aniversariante do dia 🥳</h5>
                    <div class="card-body">
                        <h5 class="card-title">{{b.name}} está de aniversário</h5>
                        <p>Mostre que você se lembrou!</p>
                    </div>
                </div>
            </div>
            <div class="row">
                <h1 class="text-light">Meus contatos</h1>
            </div>
            <div class="row">
                <table class="table table-dark">
                    <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Nome</th>
                            <th scope="col">Telefone principal</th>
                            <th scope="col"> </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="i, index in info">
                            <th scope="row">{{ i.id }}</th>
                            <td><a :href="'show.html?user='+i.id">{{ i.name }}</a></td>
                            <td v-if="i.phones[0] != ' '">{{ i.phones[0] }}</td>
                            <td v-if="i.phones[0] == ' '"><span class="text-secondary"> Nenhum telefone </span></td>
                            <td><button class="btn btn-danger" v-on:click="deletePerson(i.id, index)">x</button></td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div class="row">
                <h5 class="text-light">
                    Novo Contato
                </h5>
            </div>
            <div class="row">
                <form>
                    <div class="row">
                        <div class="col">
                            <div class="form-group">
                                <label class="text-secondary" for="formGroupExampleInput">Nome</label>
                                <input v-model="newPerson.name" class="form-control" id="formGroupExampleInput" placeholder="Nome completo">
                            </div>
                        </div>
                        <div class="col">
                            <div class="form-group">
                                <label class="text-secondary" for="formGroupExampleInput2">E-mail</label>
                                <input v-model="newPerson.email" class="form-control" id="formGroupExampleInput2" placeholder="exemplo@email.com">
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col">
                            <div class="form-group">
                                <label class="text-secondary" for="formGroupExampleInput2">Data de nascimento</label>
                                <input type="date" v-model="newPerson.birthday" class="form-control" id="formGroupExampleInput2" placeholder="dd/mm/yyyy">
                            </div>
                        </div>
                        <div class="col">
                            <div class="form-group">
                                <label class="text-secondary" for="formGroupExampleInput2">Empresa</label>
                                <input v-model="newPerson.company" class="form-control" id="formGroupExampleInput2" placeholder="Empresa">
                            </div>
                        </div>
                    </div>
                    <a class="btn btn-info" v-on:click="createPerson()">
                        <span class="text-light">Enviar</span>
                    </a>
                    <p class="text-muted"> {dev-tip}: experimente inserir um usuário que faz aniversário hoje para testar o alerta de aniversariante! </p>
                </form>
            </div>
        </div>
    `
  })