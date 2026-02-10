<#
Script: setup-node-and-run.ps1
Objetivo: tentar instalar Node.js (via winget quando possível) e então rodar `npm install` e `npm run dev`.
Uso: abra PowerShell como administrador, vá para a pasta do projeto e execute:
  Set-ExecutionPolicy Bypass -Scope Process -Force
  .\scripts\setup-node-and-run.ps1
#>

function Test-CommandExists {
    param([string]$cmd)
    $null -ne (Get-Command $cmd -ErrorAction SilentlyContinue)
}

Write-Host "== Verificando Node.js e npm ==" -ForegroundColor Cyan

if ((Test-CommandExists -cmd 'node') -and (Test-CommandExists -cmd 'npm')) {
    Write-Host "Node e npm já instalados:" -ForegroundColor Green
    node -v
    npm -v
} else {
    Write-Host "Node/npm não encontrados." -ForegroundColor Yellow

    if (Test-CommandExists -cmd 'winget') {
        Write-Host "Tentando instalar Node.js LTS via winget (requer privilégios de administrador)..." -ForegroundColor Cyan
        try {
            winget install OpenJS.NodeJS.LTS -e --silent
        } catch {
            Write-Host "Falha ao instalar via winget: $_" -ForegroundColor Red
            Write-Host "Por favor, instale manualmente a partir de https://nodejs.org e reexecute este script." -ForegroundColor Yellow
            exit 1
        }

        # Após instalação, recarregar variáveis de ambiente no processo atual pode não funcionar
        Write-Host "Instalação via winget solicitada. Feche e reabra o terminal caso as versões não sejam mostradas." -ForegroundColor Cyan
    } else {
        Write-Host "winget não encontrado. Por favor instale Node.js manualmente: https://nodejs.org (LTS)." -ForegroundColor Yellow
        exit 1
    }

    # Verifica novamente
    Start-Sleep -Seconds 2
    if ((Test-CommandExists -cmd 'node') -and (Test-CommandExists -cmd 'npm')) {
        Write-Host "Node e npm instalados com sucesso:" -ForegroundColor Green
        node -v
        npm -v
    } else {
        Write-Host "Não foi possível detectar node/npm após tentativa de instalação. Feche e reabra o terminal e execute novamente." -ForegroundColor Red
        exit 1
    }
}

# Agora instalar dependências e iniciar dev server
Write-Host "\n== Instalando dependências (npm install) ==" -ForegroundColor Cyan
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "npm install falhou. Verifique os erros acima." -ForegroundColor Red
    exit $LASTEXITCODE
}

Write-Host "\n== Iniciando servidor de desenvolvimento (npm run dev) ==" -ForegroundColor Cyan
try {
    Start-Process -FilePath "npm" -ArgumentList 'run','dev' -WorkingDirectory (Get-Location) -PassThru | Out-Null
    Write-Host "Servidor iniciado em background (processo criado)." -ForegroundColor Green
} catch {
    Write-Host "Falha ao iniciar em background, iniciando em primeiro plano..." -ForegroundColor Yellow
    npm run dev
}

Write-Host "Script finalizado." -ForegroundColor Green
