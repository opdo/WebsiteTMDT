using Lab01.Helper;
using PayPal.Api;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Lab01.Controllers
{
    public class PaypalController : Controller
    {
        private PayPal.Api.Payment payment;
        // GET: Paypal
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult PaymentWithPaypal(int? IdDonHang)
        {
            //var a = PayPal.Api.ConfigManager.Instance.GetProperties();
            //getting the apiContext as earlier 

            try
            {

                //object paypalConfigSection = null;

                //try
                //{
                //    paypalConfigSection = System.Configuration.ConfigurationManager.GetSection("paypal");
                //}
                //catch (System.Exception ex)
                //{
                //    throw new PayPal.ConfigException("Unable to load 'paypal' section from *.config: " + ex.Message);
                //}


                //System.Configuration.NameValueConfigurationCollection settings = (System.Configuration.NameValueConfigurationCollection)paypalConfigSection.GetType().GetProperty("Settings").GetValue(paypalConfigSection, null);
                //foreach (string key in settings.AllKeys)
                //{
                //   // this.configValues.Add(settings[key].Name, settings[key].Value);
                //}

               APIContext apiContext = Configuration.GetAPIContext();

                string payerId = Request.Params["PayerID"];

                if (string.IsNullOrEmpty(payerId))
                {
                    //this section will be executed first because PayerID doesn't exist 
                    //it is returned by the create function call of the payment class 

                    // Creating a payment 
                    // baseURL is the url on which paypal sendsback the data. 
                    // So we have provided URL of this controller only 
                    string baseURI = Request.Url.Scheme + "://" + Request.Url.Authority + "/Paypal/PaymentWithPayPal?";

                    //guid we are generating for storing the paymentID received in  session
                    //after calling the create function and it is used in the payment execution


                    var guid = IdDonHang;

                    //CreatePayment function gives us the payment approval url 
                    //on which payer is redirected for paypal account payment 
                    var createdPayment = this.CreatePayment(apiContext, baseURI + "guid=" + guid, IdDonHang);
                    //get links returned from paypal in response to Create function  call

                    var links = createdPayment.links.GetEnumerator();

                    string paypalRedirectUrl = null;

                    while (links.MoveNext())
                    {
                        Links lnk = links.Current;

                        if (lnk.rel.ToLower().Trim().Equals("approval_url"))
                        {
                            //saving the payapalredirect URL to which user will be  redirected for payment
                            paypalRedirectUrl = lnk.href;
                        }
                    }

                    // saving the paymentID in the key guid 
                    Session.Add(guid.ToString(), createdPayment.id);

                    return Redirect(paypalRedirectUrl);
                }
                else
                {
                    // This section is executed when we have received all the payments parameters
                    var guid = Request.Params["guid"];

                    var executedPayment = ExecutePayment(apiContext, payerId, guid as string);

                    if (executedPayment.state.ToLower() == "approved")
                    {
                        return View("FailureView");
                    }
                }
            }
            catch (Exception ex)
            {
                Logger.Log("Error" + ex.Message);
                return View("FailureView");
            }

            return View("SuccessView");
        }

        public ActionResult SuccessView()
        {
            //string payerId = Request.Params["PayerID"];
            //if (string.IsNullOrEmpty(payerId)) View("FailureView");
            return View();
        }

        public ActionResult FailureView()
        {
          
            return View();
        }

        private Payment CreatePayment(APIContext apiContext, string redirectUrl, int? IdDonHang)
        {
            string tien = "";
            var itemList = new ItemList() { items = new List<Item>() };
            //Các giá trị bao gồm danh sách sản phẩm, thông tin đơn hàng 
            //Sẽ được thay đổi bằng hành vi thao tác mua hàng trên website 
            using (THEGIOIDIDONGEntities db = new THEGIOIDIDONGEntities())
            {
                var donhang = db.DONHANGs.Where(x => x.IdDonHang == IdDonHang).FirstOrDefault();
                //foreach (var chitiet in donhang.CHITIET_DONHANG)
                //{
                //    var sp = db.SANPHAMs.Where(x => x.IdSP == chitiet.IdSP).FirstOrDefault();
                //    var item = new Item()
                //    {
                //        //Thông tin đơn hàng 
                //        name = sp.TenSP,
                //        currency = "USD",
                //        price = sp.GiaSP.ToString(),
                //        quantity = chitiet.SoLuong.ToString(),
                //        sku = sp.IdSP.ToString()
                //    };
                //    itemList.items.Add(item);
                //}
                itemList.items.Add(new Item()
                {
                    //Thông tin đơn hàng 
                    name = "Thanh toan",
                    currency = "USD",
                    price = donhang.TongTien.ToString(),
                    quantity = "1",
                    sku = "sku"
                });
                tien = donhang.TongTien.ToString();
            }

            //Hình thức thanh toán qua paypal 
            var payer = new Payer() { payment_method = "paypal" };

            // Configure Redirect Urls here with RedirectUrls object 
            var redirUrls = new RedirectUrls()
            {
                cancel_url = redirectUrl,
                return_url = redirectUrl
            };
            //các thông tin trong đơn hàng 
            var details = new Details()
            {
                tax = "0",
                shipping = "0",
                subtotal = tien
            };
            //Đơn vị tiền tệ và tổng đơn hàng cần thanh toán 
            var amount = new Amount()
            {
                currency = "USD",
                total = tien, // Total must be equal to sum of shipping, tax and  subtotal.
                details = details
            };

            var transactionList = new List<Transaction>();
            //Tất cả thông tin thanh toán cần đưa vào transaction 
            transactionList.Add(new Transaction()
            {
                description = "Transaction description.",
                invoice_number = "your invoice number",
                amount = amount,
                item_list = itemList
            });

            this.payment = new Payment()
            {
                intent = "sale",
                payer = payer,
                transactions = transactionList,
                redirect_urls = redirUrls
            };
            // Create a payment using a APIContext 
            return this.payment.Create(apiContext);


        }
        private Payment ExecutePayment(APIContext apiContext, string payerId, string paymentId)
        {
            var paymentExecution = new PaymentExecution() { payer_id = payerId };
            this.payment = new Payment() { id = paymentId };
            return this.payment.Execute(apiContext, paymentExecution);
        }
    }
}