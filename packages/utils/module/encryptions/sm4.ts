// import base64js from 'base64js'
import './base64js';

const secretKey = 'Ag2020554f5e42gd';

/**
 * 国密SM4加密算法
 * @author c.z.s
 * @company GDT-ZWZX-DEV-PT
 * @date 2018-07
 */
function SM4_Context() {
  this.mode = 1;
  this.isPadding = true;
  this.sk = new Array(32);
}

function SM4() {
  this.SM4_ENCRYPT = 1;
  this.SM4_DECRYPT = 0;

  const SboxTable = [
    0xd6, 0x90, 0xe9, 0xfe, 0xcc, 0xe1, 0x3d, 0xb7, 0x16, 0xb6, 0x14, 0xc2, 0x28, 0xfb, 0x2c, 0x05,
    0x2b, 0x67, 0x9a, 0x76, 0x2a, 0xbe, 0x04, 0xc3, 0xaa, 0x44, 0x13, 0x26, 0x49, 0x86, 0x06, 0x99,
    0x9c, 0x42, 0x50, 0xf4, 0x91, 0xef, 0x98, 0x7a, 0x33, 0x54, 0x0b, 0x43, 0xed, 0xcf, 0xac, 0x62,
    0xe4, 0xb3, 0x1c, 0xa9, 0xc9, 0x08, 0xe8, 0x95, 0x80, 0xdf, 0x94, 0xfa, 0x75, 0x8f, 0x3f, 0xa6,
    0x47, 0x07, 0xa7, 0xfc, 0xf3, 0x73, 0x17, 0xba, 0x83, 0x59, 0x3c, 0x19, 0xe6, 0x85, 0x4f, 0xa8,
    0x68, 0x6b, 0x81, 0xb2, 0x71, 0x64, 0xda, 0x8b, 0xf8, 0xeb, 0x0f, 0x4b, 0x70, 0x56, 0x9d, 0x35,
    0x1e, 0x24, 0x0e, 0x5e, 0x63, 0x58, 0xd1, 0xa2, 0x25, 0x22, 0x7c, 0x3b, 0x01, 0x21, 0x78, 0x87,
    0xd4, 0x00, 0x46, 0x57, 0x9f, 0xd3, 0x27, 0x52, 0x4c, 0x36, 0x02, 0xe7, 0xa0, 0xc4, 0xc8, 0x9e,
    0xea, 0xbf, 0x8a, 0xd2, 0x40, 0xc7, 0x38, 0xb5, 0xa3, 0xf7, 0xf2, 0xce, 0xf9, 0x61, 0x15, 0xa1,
    0xe0, 0xae, 0x5d, 0xa4, 0x9b, 0x34, 0x1a, 0x55, 0xad, 0x93, 0x32, 0x30, 0xf5, 0x8c, 0xb1, 0xe3,
    0x1d, 0xf6, 0xe2, 0x2e, 0x82, 0x66, 0xca, 0x60, 0xc0, 0x29, 0x23, 0xab, 0x0d, 0x53, 0x4e, 0x6f,
    0xd5, 0xdb, 0x37, 0x45, 0xde, 0xfd, 0x8e, 0x2f, 0x03, 0xff, 0x6a, 0x72, 0x6d, 0x6c, 0x5b, 0x51,
    0x8d, 0x1b, 0xaf, 0x92, 0xbb, 0xdd, 0xbc, 0x7f, 0x11, 0xd9, 0x5c, 0x41, 0x1f, 0x10, 0x5a, 0xd8,
    0x0a, 0xc1, 0x31, 0x88, 0xa5, 0xcd, 0x7b, 0xbd, 0x2d, 0x74, 0xd0, 0x12, 0xb8, 0xe5, 0xb4, 0xb0,
    0x89, 0x69, 0x97, 0x4a, 0x0c, 0x96, 0x77, 0x7e, 0x65, 0xb9, 0xf1, 0x09, 0xc5, 0x6e, 0xc6, 0x84,
    0x18, 0xf0, 0x7d, 0xec, 0x3a, 0xdc, 0x4d, 0x20, 0x79, 0xee, 0x5f, 0x3e, 0xd7, 0xcb, 0x39, 0x48,
  ];

  const FK = [0xa3b1bac6, 0x56aa3350, 0x677d9197, 0xb27022dc];

  const CK = [
    0x00070e15, 0x1c232a31, 0x383f464d, 0x545b6269, 0x70777e85, 0x8c939aa1, 0xa8afb6bd, 0xc4cbd2d9,
    0xe0e7eef5, 0xfc030a11, 0x181f262d, 0x343b4249, 0x50575e65, 0x6c737a81, 0x888f969d, 0xa4abb2b9,
    0xc0c7ced5, 0xdce3eaf1, 0xf8ff060d, 0x141b2229, 0x30373e45, 0x4c535a61, 0x686f767d, 0x848b9299,
    0xa0a7aeb5, 0xbcc3cad1, 0xd8dfe6ed, 0xf4fb0209, 0x10171e25, 0x2c333a41, 0x484f565d, 0x646b7279,
  ];

  this.GET_ULONG_BE = function (b, i) {
    return (
      ((b[i] & 0xff) << 24) |
      ((b[i + 1] & 0xff) << 16) |
      ((b[i + 2] & 0xff) << 8) |
      (b[i + 3] & 0xff & 0xffffffff)
    );
  };

  this.PUT_ULONG_BE = function (n, b, i) {
    const t1 = 0xff & (n >> 24);
    const t2 = 0xff & (n >> 16);
    const t3 = 0xff & (n >> 8);
    const t4 = 0xff & n;
    b[i] = t1 > 128 ? t1 - 256 : t1;
    b[i + 1] = t2 > 128 ? t2 - 256 : t2;
    b[i + 2] = t3 > 128 ? t3 - 256 : t3;
    b[i + 3] = t4 > 128 ? t4 - 256 : t4;
  };

  this.SHL = function (x, n) {
    return (x & 0xffffffff) << n;
  };

  this.ROTL = function (x, n) {
    const s = this.SHL(x, n);
    const ss = x >> (32 - n);
    return this.SHL(x, n) | (x >> (32 - n));
  };

  this.sm4Lt = function (ka) {
    let bb = 0;
    let c = 0;
    const a = new Array(4);
    const b = new Array(4);
    this.PUT_ULONG_BE(ka, a, 0);
    b[0] = this.sm4Sbox(a[0]);
    b[1] = this.sm4Sbox(a[1]);
    b[2] = this.sm4Sbox(a[2]);
    b[3] = this.sm4Sbox(a[3]);
    bb = this.GET_ULONG_BE(b, 0);
    c = bb ^ this.ROTL(bb, 2) ^ this.ROTL(bb, 10) ^ this.ROTL(bb, 18) ^ this.ROTL(bb, 24);
    return c;
  };

  this.sm4F = function (x0, x1, x2, x3, rk) {
    return x0 ^ this.sm4Lt(x1 ^ x2 ^ x3 ^ rk);
  };

  this.sm4CalciRK = function (ka) {
    let bb = 0;
    let rk = 0;
    const a = new Array(4);
    const b = new Array(4);
    this.PUT_ULONG_BE(ka, a, 0);
    b[0] = this.sm4Sbox(a[0]);
    b[1] = this.sm4Sbox(a[1]);
    b[2] = this.sm4Sbox(a[2]);
    b[3] = this.sm4Sbox(a[3]);
    bb = this.GET_ULONG_BE(b, 0);
    rk = bb ^ this.ROTL(bb, 13) ^ this.ROTL(bb, 23);
    return rk;
  };

  this.sm4Sbox = function (inch) {
    const i = inch & 0xff;
    const retVal = SboxTable[i];
    return retVal > 128 ? retVal - 256 : retVal;
  };

  this.sm4_setkey_enc = function (ctx, key) {
    if (ctx == null) {
      alert('ctx is null!');
      return false;
    }
    if (key == null || key.length != 16) {
      alert('key error!');
      return false;
    }
    ctx.mode = this.SM4_ENCRYPT;
    this.sm4_setkey(ctx.sk, key);
  };

  this.sm4_setkey = function (SK, key) {
    const MK = new Array(4);
    const k = new Array(36);
    var i = 0;
    MK[0] = this.GET_ULONG_BE(key, 0);
    MK[1] = this.GET_ULONG_BE(key, 4);
    MK[2] = this.GET_ULONG_BE(key, 8);
    MK[3] = this.GET_ULONG_BE(key, 12);
    k[0] = MK[0] ^ FK[0];
    k[1] = MK[1] ^ FK[1];
    k[2] = MK[2] ^ FK[2];
    k[3] = MK[3] ^ FK[3];
    for (var i = 0; i < 32; i++) {
      k[i + 4] = k[i] ^ this.sm4CalciRK(k[i + 1] ^ k[i + 2] ^ k[i + 3] ^ CK[i]);
      SK[i] = k[i + 4];
    }
  };
  this.padding = function (input, mode) {
    if (input == null) {
      return null;
    }
    let ret = null;
    if (mode == this.SM4_ENCRYPT) {
      var p = parseInt(16 - (input.length % 16));
      ret = input.slice(0);
      for (let i = 0; i < p; i++) {
        ret[input.length + i] = p;
      }
    } else {
      var p = input[input.length - 1];
      ret = input.slice(0, input.length - p);
    }
    return ret;
  };
  this.sm4_one_round = function (sk, input, output) {
    let i = 0;
    const ulbuf = new Array(36);
    ulbuf[0] = this.GET_ULONG_BE(input, 0);
    ulbuf[1] = this.GET_ULONG_BE(input, 4);
    ulbuf[2] = this.GET_ULONG_BE(input, 8);
    ulbuf[3] = this.GET_ULONG_BE(input, 12);
    while (i < 32) {
      ulbuf[i + 4] = this.sm4F(ulbuf[i], ulbuf[i + 1], ulbuf[i + 2], ulbuf[i + 3], sk[i]);
      i++;
    }
    this.PUT_ULONG_BE(ulbuf[35], output, 0);
    this.PUT_ULONG_BE(ulbuf[34], output, 4);
    this.PUT_ULONG_BE(ulbuf[33], output, 8);
    this.PUT_ULONG_BE(ulbuf[32], output, 12);
  };

  this.sm4_crypt_ecb = function (ctx, input) {
    if (input == null) {
      alert('input is null!');
    }
    if (ctx.isPadding && ctx.mode == this.SM4_ENCRYPT) {
      input = this.padding(input, this.SM4_ENCRYPT);
    }

    var i = 0;
    let length = input.length;
    let bous = [];
    for (; length > 0; length -= 16) {
      const out = new Array(16);
      const ins = input.slice(i * 16, 16 * (i + 1));
      this.sm4_one_round(ctx.sk, ins, out);
      bous = bous.concat(out);
      i++;
    }

    let output = bous;
    if (ctx.isPadding && ctx.mode == this.SM4_DECRYPT) {
      output = this.padding(output, this.SM4_DECRYPT);
    }
    for (var i = 0; i < output.length; i++) {
      if (output[i] < 0) {
        output[i] = output[i] + 256;
      }
    }
    return output;
  };

  this.sm4_crypt_cbc = function (ctx, iv, input) {
    if (iv == null || iv.length != 16) {
      alert('iv error!');
    }

    if (input == null) {
      alert('input is null!');
    }

    if (ctx.isPadding && ctx.mode == this.SM4_ENCRYPT) {
      input = this.padding(input, this.SM4_ENCRYPT);
    }

    var i = 0;
    let length = input.length;
    let bous = [];
    if (ctx.mode == this.SM4_ENCRYPT) {
      var k = 0;
      for (; length > 0; length -= 16) {
        var out = new Array(16);
        var out1 = new Array(16);
        var ins = input.slice(k * 16, 16 * (k + 1));

        for (i = 0; i < 16; i++) {
          out[i] = ins[i] ^ iv[i];
        }
        this.sm4_one_round(ctx.sk, out, out1);
        iv = out1.slice(0, 16);
        bous = bous.concat(out1);
        k++;
      }
    } else {
      let temp = [];
      var k = 0;
      for (; length > 0; length -= 16) {
        var out = new Array(16);
        var out1 = new Array(16);
        var ins = input.slice(k * 16, 16 * (k + 1));
        temp = ins.slice(0, 16);
        sm4_one_round(ctx.sk, ins, out);
        for (i = 0; i < 16; i++) {
          out1[i] = out[i] ^ iv[i];
        }
        iv = temp.slice(0, 16);
        bous = bous.concat(out1);
        k++;
      }
    }

    let output = bous;
    if (ctx.isPadding && ctx.mode == this.SM4_DECRYPT) {
      output = this.padding(output, this.SM4_DECRYPT);
    }

    for (var i = 0; i < output.length; i++) {
      if (output[i] < 0) {
        output[i] = output[i] + 256;
      }
    }
    return output;
  };
}

function SM4Util() {
  this.secretKey = secretKey;
  this.iv = '';
  this.hexString = false;

  this.encryptData_ECB = function (plainText) {
    try {
      const sm4 = new SM4();
      const ctx = new SM4_Context();
      ctx.isPadding = true;
      ctx.mode = sm4.SM4_ENCRYPT;
      const keyBytes = stringToByte(this.secretKey);
      sm4.sm4_setkey_enc(ctx, keyBytes);
      const encrypted = sm4.sm4_crypt_ecb(ctx, stringToByte(plainText));
      const cipherText = base64js.fromByteArray(encrypted);
      if (cipherText != null && cipherText.trim().length > 0) {
        cipherText.replace(/(\s*|\t|\r|\n)/g, '');
      }
      return cipherText;
    } catch (e) {
      console.error(e);
      return null;
    }
  };

  this.encryptData_CBC = function (plainText) {
    try {
      const sm4 = new SM4();
      const ctx = new SM4_Context();
      ctx.isPadding = true;
      ctx.mode = sm4.SM4_ENCRYPT;

      const keyBytes = stringToByte(this.secretKey);
      const ivBytes = stringToByte(this.iv);

      sm4.sm4_setkey_enc(ctx, keyBytes);
      const encrypted = sm4.sm4_crypt_cbc(ctx, ivBytes, stringToByte(plainText));
      const cipherText = base64js.fromByteArray(encrypted);
      if (cipherText != null && cipherText.trim().length > 0) {
        cipherText.replace(/(\s*|\t|\r|\n)/g, '');
      }
      return cipherText;
    } catch (e) {
      console.error(e);
      return null;
    }
  };

  var stringToByte = function (str) {
    const bytes = [];
    let len, c;
    len = str.length;
    for (let i = 0; i < len; i++) {
      c = str.charCodeAt(i);
      if (c >= 0x010000 && c <= 0x10ffff) {
        bytes.push(((c >> 18) & 0x07) | 0xf0);
        bytes.push(((c >> 12) & 0x3f) | 0x80);
        bytes.push(((c >> 6) & 0x3f) | 0x80);
        bytes.push((c & 0x3f) | 0x80);
      } else if (c >= 0x000800 && c <= 0x00ffff) {
        bytes.push(((c >> 12) & 0x0f) | 0xe0);
        bytes.push(((c >> 6) & 0x3f) | 0x80);
        bytes.push((c & 0x3f) | 0x80);
      } else if (c >= 0x000080 && c <= 0x0007ff) {
        bytes.push(((c >> 6) & 0x1f) | 0xc0);
        bytes.push((c & 0x3f) | 0x80);
      } else {
        bytes.push(c & 0xff);
      }
    }
    return bytes;
  };

  const byteToString = function (arr) {
    if (typeof arr === 'string') {
      return arr;
    }
    let str = '',
      _arr = arr;
    for (let i = 0; i < _arr.length; i++) {
      const one = _arr[i].toString(2),
        v = one.match(/^1+?(?=0)/);
      if (v && one.length == 8) {
        const bytesLength = v[0].length;
        let store = _arr[i].toString(2).slice(7 - bytesLength);
        for (let st = 1; st < bytesLength; st++) {
          store += _arr[st + i].toString(2).slice(2);
        }
        str += String.fromCharCode(parseInt(store, 2));
        i += bytesLength - 1;
      } else {
        str += String.fromCharCode(_arr[i]);
      }
    }
    return str;
  };
}

export const toSM4 = function (str) {
  return new SM4Util().encryptData_ECB(str);
};
