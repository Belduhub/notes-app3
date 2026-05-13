const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const Notes = sequelize.define('Notes', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    judul: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    isi: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    tanggal_dibuat: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    }
}, {
    tableName: 'notes',
    timestamps: false,
});

module.exports = Notes;
