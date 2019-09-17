using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Lab01.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            List<SANPHAM> sp = new List<SANPHAM>();
            using (THEGIOIDIDONGEntities db = new THEGIOIDIDONGEntities())
            {
                sp = db.SANPHAMs.ToList();
            }
            return View(sp);
        }

        public ActionResult ThanhToan()
        {
            List<SANPHAM> listSP = new List<SANPHAM>();
            foreach (var item in Request.Cookies.AllKeys)
            {
                try
                {
                    int id = int.Parse(item.Replace("sanpham", String.Empty));
                    int sl = int.Parse(Request.Cookies[item].Value.ToString());
                    using (THEGIOIDIDONGEntities db = new THEGIOIDIDONGEntities())
                    {
                        var sp = db.SANPHAMs.Where(x => x.IdSP == id).FirstOrDefault();
                        listSP.Add(sp);
                    }
                }
                catch
                {

                }
            }

            if (listSP.Count < 1) return RedirectToAction("Index");
            return View(listSP);
        }
        [HttpPost]
        public ActionResult ThanhToan(string phone, string name)
        {
            if (String.IsNullOrEmpty(phone) || String.IsNullOrEmpty(name)) return View();
            using (THEGIOIDIDONGEntities db = new THEGIOIDIDONGEntities())
            {
                var kh = db.KHACHHANGs.Where(x => x.SoDienThoai.Equals(phone)).FirstOrDefault();
                if (kh == null)
                {
                    kh = db.KHACHHANGs.Create();
                    kh.SoDienThoai = phone;
                    kh.TenKhach = name;
                    db.KHACHHANGs.Add(kh);
                }
                else
                {
                    kh.TenKhach = name;
                }
                db.SaveChanges();

                var donhang = db.DONHANGs.Create();
                donhang.IdKhach = kh.IdKhach;
                float total = 0;
                db.DONHANGs.Add(donhang);
                db.SaveChanges();

                foreach (var item in Request.Cookies.AllKeys)
                {
                    try
                    {
                        int id = int.Parse(item.Replace("sanpham", String.Empty));
                        int sl = int.Parse(Request.Cookies[item].Value.ToString());
                        var sp = db.SANPHAMs.Where(x => x.IdSP == id).FirstOrDefault();
                        total += sl * (int)sp.GiaSP;
                        var chitiet = db.CHITIET_DONHANG.Create();
                        chitiet.IdDonHang = donhang.IdDonHang;
                        chitiet.IdSP = id;
                        chitiet.SoLuong = sl;
                        donhang.CHITIET_DONHANG.Add(chitiet);
                        db.SaveChanges();
                    }
                    catch (Exception ex)
                    {

                    }
                }

                donhang.TongTien = total;
                db.SaveChanges();
                return RedirectToAction("PaymentWithPaypal", "Paypal", new { IdDonHang = donhang.IdDonHang });
            }

            
        }


        [HttpPost]
        public string getPhone(string phone)
        {
            string name = "";
            using (THEGIOIDIDONGEntities db = new THEGIOIDIDONGEntities())
            {
                var kh = db.KHACHHANGs.Where(x => x.SoDienThoai.Equals(phone)).FirstOrDefault();
                if (kh == null) return "";
                name = kh.TenKhach;
            }
            return name;
        }
    }
}