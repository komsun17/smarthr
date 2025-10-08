const axios = require('axios');
const xlsx = require('xlsx');

class TimemintService {
    constructor(apiKey) {
        this.apiKey = apiKey;
        this.baseUrl = 'https://api.timemint.co/api/v1/';
    }

    async fetchAttendance(date) {
        // ตัวอย่างการดึงข้อมูลการลงเวลา
        try {
            const response = await axios.get(`${this.baseUrl}attendance`, {
                headers: { 'Authorization': `Bearer ${this.apiKey}` },
                params: { date }
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    async importAttendanceFromExcel(filePath) {
        // อ่านข้อมูลจากไฟล์ Excel
        try {
            // ตรวจสอบว่าไฟล์มีอยู่จริง
            if (!filePath) {
                throw new Error('ไม่พบไฟล์ที่ต้องการ import');
            }

            const workbook = xlsx.readFile(filePath);
            const sheetName = workbook.SheetNames[0];
            
            if (!sheetName) {
                throw new Error('ไม่พบ sheet ในไฟล์ Excel');
            }

            const worksheet = workbook.Sheets[sheetName];
            const data = xlsx.utils.sheet_to_json(worksheet);
            
            // ตรวจสอบว่ามีข้อมูลหรือไม่
            if (!data || data.length === 0) {
                throw new Error('ไม่พบข้อมูลในไฟล์ Excel');
            }

            // Validate ข้อมูลพื้นฐาน
            this.validateExcelData(data);
            
            return data; // คืนข้อมูล attendance ที่อ่านได้จาก Excel
        } catch (error) {
            throw new Error(`เกิดข้อผิดพลาดในการอ่านไฟล์ Excel: ${error.message}`);
        }
    }

    // เพิ่มฟังก์ชัน validation สำหรับข้อมูล Excel
    validateExcelData(data) {
        const requiredFields = ['employee_id', 'name', 'date']; // ปรับตามโครงสร้างข้อมูลจริง
        
        for (let i = 0; i < data.length; i++) {
            const row = data[i];
            for (const field of requiredFields) {
                if (!row[field]) {
                    throw new Error(`แถวที่ ${i + 1}: ไม่พบข้อมูล ${field}`);
                }
            }
        }
    }

    // สามารถเพิ่มเมธอดอื่นๆ สำหรับดึงข้อมูลเพิ่มเติมได้
}

module.exports = TimemintService;
