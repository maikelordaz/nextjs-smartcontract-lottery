/*
 * Este archivo lo uso para poder importar el abi y el address en los archivos que necesite
 * podría hacerlo directamente donde lo necesite, pero asi tengo mejor control
 */
const abi = require("../constants/abi.json")
const contractAddresses = require("../constants/contractAddresses.json")

module.exports = {
    abi,
    contractAddresses,
}
