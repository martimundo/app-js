//criar metodo para cadastrar as despesas no botão para cadastro da despeas

//class para cadastrar despesas
//Nessa classe será utilizado a feature class com seus respctivos atributos.

class Despesa{
    constructor(ano, mes, dia, tipo, descricao, valor){
        this.ano = ano
        this.mes = mes
        this.dia = dia
        this.tipo = tipo
        this.descricao = descricao
        this.valor = valor
    }  
    
    validarDados(){
        for(let i in this){
            if(this[i]== undefined || this[i] =='' || this[i] ==null){
                return false
            }
        }
        return true
    }
}

class Bd {

    constructor(){
        let id = localStorage.getItem('id')

        if(id === null){
            localStorage.setItem('id', 0)
        }
    }
    
    getproximoId(){
        let proximoId = localStorage.getItem('id')
        return parseInt(proximoId) + 1
    }

    gravar(d){
               
        let id = this.getproximoId()

        localStorage.setItem(id, JSON.stringify(d))

        localStorage.setItem('id', id)
    }
    recuperarTodosRegistro(){
        
        //array para armazenar dados
        let despesas = Array()
        
        let id = localStorage.getItem('id')

        //recupera os dados cadastrados em localStorage
        for(let i = 1; i <= id; i++ ){

            let despesa = JSON.parse(localStorage.getItem(i))

            //verificar a possibilidade de haver indices que foram pulados/removidos
            //nestes casos nos vamos pular esses indíces

            if(despesa === null){
                continue
            }
            despesas.id = i
            despesas.push(despesa)
        }
        return despesas
    }
    pesquisar(despesa){

        let despesasFiltradas = Array()
        despesasFiltradas = this.recuperarTodosRegistro()        
        console.log(despesasFiltradas)
        console.log(despesa)

        //ano
        //validar se existe valor para ser presquisa. caso seja false a pesquisa não funcionará
        if(despesa.ano != ''){
            console.log('filtro de ano');
            despesasFiltradas = despesasFiltradas.filter(d => d.ano == despesa.ano)
        }
        //mes
        if(despesa.mes != ''){
            console.log('filtro de mes');
            despesasFiltradas =despesasFiltradas.filter(d => d.mes == despesa.mes)
        }
        //dia
        if(despesa.dia != ''){
            console.log('filtro de dia');
            despesasFiltradas =despesasFiltradas.filter(d => d.dia == despesa.dia)
        }
        //tipo
        if(despesa.tipo != ''){
            console.log('filtro de tipo');
            despesasFiltradas =despesasFiltradas.filter(d => d.tipo == despesa.tipo)
        }

        //descricao
        if(despesa.descricao != ''){
            console.log('filtro de descricao');
            despesasFiltradas =despesasFiltradas.filter(d => d.descricao == despesa.descricao)
        }
        //valor
        if(despesa.valor != ''){
            console.log('filtro de valor');
            despesasFiltradas =despesasFiltradas.filter(d => d.valor == despesa.valor)
        }
        return despesasFiltradas
    }
    remover(id){
        localStorage.removeItem(id)
    }
}
let bd = new Bd()

//metodo para cadastrar
function cadastrarDespesas(){
    //capturar valor dos campos para salvar no local storage
    //Os daados são capturados a partir do Id dos elementos
    /*
    *Após referenciar os elementos sera necessário guardar em uma variavel para utilizar
    *os atributos e metodos
     */

    let ano = document.getElementById('ano')
    let mes = document.getElementById('mes')
    let dia = document.getElementById('dia')
    let tipo = document.getElementById('tipo')
    let descricao = document.getElementById('descricao')
    let valor = document.getElementById('valor')

    /*
    *existem duas possibilidades para recuperar os dados da variavel
    *1 - através da referencia que estamos associando a variavel e utilizar o operador "."
    *2 - ou utilizar o value na propria instrução
     */
    

    let despesa = new Despesa
    (
        ano.value, 
        mes.value, 
        dia.value, 
        tipo.value, 
        descricao.value, 
        valor.value
    )

    if (despesa.validarDados()){

        bd.gravar(despesa)

        document.getElementById('modal_titulo').innerHTML = 'Registro Salvo com Sucesso'
        document.getElementById('modal_titulo_id').className = 'modal-header text-success'
        document.getElementById('modal_conteudo').innerHTML = 'Os dados foram gravados com sucesso!!!'
        document.getElementById('modal_btn').innerHTML = 'OK'
        document.getElementById('modal_btn').className = 'btn btn-success'
        
        //dialog Sucesso
        $('#modalRegistraDespesa').modal('show')
        ano.value = ''
        mes.value = ''
        dia.value = ''
        tipo.value = ''
        descricao.value = '' 
        valor.value = ''
        
    }else{

        document.getElementById('modal_titulo').innerHTML = 'Erro ao incluir os dados!!'
        document.getElementById('modal_titulo_id').className = ' modal-header text-danger'
        document.getElementById('modal_conteudo').innerHTML = 'Todos os campos precisam ser preenchidos!!!'
        document.getElementById('modal_btn').innerHTML = 'Voltar e Corrigir'
        document.getElementById('modal_btn').className = 'btn btn-danger'
       
        //dialog de Erro
        $('#modalRegistraDespesa').modal('show')

    }
    
    
}

function carregarDespesas(despesas = Array(), filtro = false){

    if(despesas.length == 0 && filtro == false){
        despesas = bd.recuperarTodosRegistro()
    }

    //selecionando o elemento tbody da tabela
    let listaDespesas = document.getElementById('listaDespesas')
    listaDespesas.innerHTML = ''

    
   //percorrer o array despesas, listando cada despesas de forma dinamica
    despesas.forEach(function(d){
        
        //criando linha (tr)
        var linha = listaDespesas.insertRow()
       //criar as colunas(td)
       linha.insertCell(0).innerHTML = `${d.dia}/${d.mes}/${d.ano}`   
       
       //ajustar o tipo      
       switch (d.tipo){
            case '1': d.tipo = 'Alimentação'
                break
            case '2': d.tipo = 'Educação'
                break
            case '3': d.tipo = 'Lazer'
                break
            case '4': d.tipo = 'Saúde'
                break
            case '5': d.tipo = 'Transporte'
                break
       }

       linha.insertCell(1).innerHTML = d.tipo
       linha.insertCell(2).innerHTML = d.descricao
       linha.insertCell(3).innerHTML = d.valor

       //criar botão de exclusão

       let btn = document.createElement("button")
       btn.className = 'btn btn-danger'
       btn.innerHTML = '<i class="fa fa-times"></i>'
       btn.id = `id_despesa_${d.id}` 
       btn.onclick = function(){
            let id = this.id.replace('id_despesa_', '')
            alert(id)
            bd.remover(id)

            window.location.reload()       
       } 
       linha.insertCell(4).append(btn)
       
    })
}

function pesquisarDespesas(){

    let ano = document.getElementById('ano').value
    let mes  = document.getElementById('mes').value
    let dia = document.getElementById('dia').value
    let tipo = document.getElementById('tipo').value
    let descricao = document.getElementById('descricao').value
    let valor = document.getElementById('valor').value


    let despesa = new Despesa(ano, mes,dia, tipo, descricao, valor )

    let despesas = bd.pesquisar(despesa)

    this.carregarDespesas(despesas, true)
    
}
