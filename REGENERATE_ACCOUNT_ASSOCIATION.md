# Account Association - Instrucciones de Regeneración

## ❌ Problema Identificado

El `accountAssociation` actual está siendo rechazado por Base como inválido. Aunque el formato es correcto, la firma no es válida.

## ✅ Solución

He removido temporalmente el `accountAssociation` del manifest. Ahora necesitas:

### Paso 1: Desplegar el Manifest Sin Account Association

El archivo actual `/public/.well-known/farcaster.json` ya NO tiene `accountAssociation`.

**Despliega esta versión ahora** para que el manifest esté accesible en:
```
https://base-crowdfunding.vercel.app/.well-known/farcaster.json
```

### Paso 2: Generar Nuevo Account Association

Una vez desplegado, ve a **UNO** de estos sitios:

#### Opción A: Base Developer Portal (Recomendado)
```
https://www.base.dev/preview?tab=account&url=https://base-crowdfunding.vercel.app/
```

#### Opción B: Farcaster Developer Tools
```
https://farcaster.xyz/~/developers/mini-apps/manifest?domain=base-crowdfunding.vercel.app
```

**Pasos en el sitio:**
1. Conecta tu wallet de Farcaster
2. Firma el mensaje cuando te lo solicite
3. Copia el JSON completo del `accountAssociation` que te generen

El resultado será algo como:
```json
{
  "accountAssociation": {
    "header": "eyJ...",
    "payload": "eyJ...",
    "signature": "..."
  }
}
```

### Paso 3: Añadir el Account Association al Manifest

Una vez que tengas el nuevo `accountAssociation`, añádelo al manifest:

```json
{
  "accountAssociation": {
    "header": "TU_NUEVO_HEADER",
    "payload": "TU_NUEVO_PAYLOAD",
    "signature": "TU_NUEVA_SIGNATURE"
  },
  "miniapp": {
    ...
  }
}
```

### Paso 4: Desplegar Nuevamente

Despliega el manifest completo con el nuevo `accountAssociation`.

## 📋 Validación del Manifest Actual

```
✓ Todas las validaciones pasadas:
  - Version: "1" ✓
  - Name: "Base Crowdfunding" (17/32 chars) ✓
  - Icon URL: HTTPS ✓
  - Home URL: HTTPS ✓
  - Subtitle: 23/30 chars ✓
  - Description: 134/170 chars ✓
  - Category: "finance" ✓
  - Tags: 5/5 ✓
  - Screenshots: 3/3 ✓
  - Required chains: Base mainnet ✓
  - Required capabilities: 3 ✓
  - All URLs: HTTPS ✓
  - Domain: base-crowdfunding.vercel.app ✓
```

## 📁 Backup

Tu `accountAssociation` anterior ha sido guardado en:
```
/public/.well-known/farcaster.json.backup
```

Por si necesitas referencia, pero **NO lo uses** - necesitas uno nuevo.

## ⚠️ Importante

- NO copies/pegues el `accountAssociation` anterior
- Debes generar uno NUEVO usando las herramientas oficiales
- Asegúrate de que el manifest esté desplegado ANTES de generar el account association
- Usa la misma wallet de Farcaster que quieres asociar al mini app

Una vez completes estos pasos, tu manifest será válido y Base podrá indexar tu mini app.
