'use strict'

let itens = []

function mostrarTela(telaId) {
  document.querySelectorAll('section').forEach(sec => sec.classList.add('hidden'))
  document.getElementById(telaId).classList.remove('hidden')
}

async function buscarDados(categoria) {
  const url = `https://api.attackontitanapi.com/${categoria}`
  const response = await fetch(url)

  if (!response.ok) {
    throw new Error(`Erro ao buscar dados (${response.status})`)
  }

  const json = await response.json()
  return json.results || []
}

function mostrarGaleria(lista) {
  const galeria = document.getElementById('galeria')
  galeria.innerHTML = ''


  lista.forEach(item => {
    const card = document.createElement('div')
    card.classList.add('card')

    card.innerHTML = `
      <img src="${item.img || 'https://via.placeholder.com/300x200'}" alt="${item.name}">
      <h3>${item.name}</h3>
      <button onclick='verDetalhes(${JSON.stringify(item).replace(/'/g, "\\'")})'>Ver mais</button>
    `
    galeria.appendChild(card)
  })
}

async function carregarCategoria(categoria) {
  mostrarTela('lista')
  try {
    itens = await buscarDados(categoria)
    mostrarGaleria(itens)
  } catch (err) {
    alert('Erro ao carregar: ' + err.message)
  }
}

function verDetalhes(item) {
  mostrarTela('detalhe')

  document.getElementById('tituloDetalhe').textContent = item.name
  document.getElementById('imagemDetalhe').src = item.img || 'https://via.placeholder.com/300x200'

  // Descrição simples baseada em campos existentes
  const descricao = `
    ${item.alias?.length ? `Apelido(s): ${item.alias.join(', ')}\n` : ''}
    ${item.occupation ? `Ocupação: ${item.occupation}\n` : ''}
    ${item.status ? `Status: ${item.status}\n` : ''}
    ${item.birthplace ? `Nascimento: ${item.birthplace}\n` : ''}
    ${item.residence ? `Residência: ${item.residence}\n` : ''}
    ${item.species?.length ? `Espécie: ${item.species.join(', ')}\n` : ''}
  `.trim() || 'Descrição não encontrada.'

  document.getElementById('descricaoDetalhe').textContent = descricao
}

function voltarInicio() {
  mostrarTela('home')
}

document.getElementById('pesquisa').addEventListener('input', () => {
  const termo = document.getElementById('pesquisa').value.toLowerCase().trim()
  const filtrados = itens.filter(item => item.name.toLowerCase().includes(termo))
  mostrarGaleria(filtrados)
})

window.carregarCategoria = carregarCategoria
window.verDetalhes = verDetalhes
